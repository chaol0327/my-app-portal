module.exports = function (config) {
    var orionAuth = '';

    const express = require('express'),
        apiRoutes = express.Router(),
        request = require('superagent'),
        rp = require("request-promise");

    //API routes
    apiRoutes.all('/pec1sumiddleware', [checkSessionLock, tryPolicyLock, function (req, res) {
        policyHandle(req, res, function () {
            getLock(req, res)
        });
    }]);   //CRUD, swap
    apiRoutes.all('/policy/commit', [checkSessionLock, tryPolicyLock, function (req, res) {
        policyHandle(req, res, function () {
            releaseLock(req, res)
        });
    }]);  //commit
    apiRoutes.all('/policy/isOwnLock', isOwnPolicyLock);                          //refresh page style
    apiRoutes.all('/policy/verify', [checkSessionLock, policyHandle]);
    apiRoutes.all('/policy/load', handlePolicyLoad);        //no used yet
    apiRoutes.all('/policy/revert', revertPolicy);

    //Authenticate part
    apiRoutes.get('/authenticate', authenticate);
    apiRoutes.all('/removeAuthCookie', removeAuth);
    apiRoutes.use(checkAuthentication);
    apiRoutes.get('/checkLogin', checkLogin);

    var logger = require('bunyan').createLogger({name: "apiRoutes", type: "component"});

    //Error503
    //This error is to indicate the service is not available.
    function Error503(message) {
        this.message = message;
        this.status = 503;
    }

    Error503.prototype.toString = function () {
        return this.status + ': "' + this.message + '"';
    }

    //Authentication
    function checkLogin(req, res) {
        logger.info("checkAuth");
        res.sendStatus(200);
    }

    //--------------------Test Session------------------------------
    function saveSession(req, res) {
        req.session.isAuth = true;
        logger.info("[saveSession]:" + req.sessionID + "---" + req.session.isAuth + "---expired:" + req.session.cookie.expires);
    }

    //--------------------End------------------------------

    function authenticate(req, res) {
        logger.info("[116] authenticate");

        var authRequestHandler = new AuthenticateRequestHandler(req, res);
        authRequestHandler.processRequest();
    }

    function AuthenticateRequestHandler(httpReq, httpRes) {
        var tenantId = '',
            discoveryUrl = config.userDirectory,
            username = httpReq.query.username,
            services;

        function discover() {
            return discoverServices(tenantId, discoveryUrl)
                .then(function (_services) {
                    services = _services;
                })
        }

        function getLocalProviderName() {
            //return "Local Provider";
            return getProvider(services, config.localProvider, tenantId);
        }

        function getAuthRedirectUrl(providerName) {
            logger.info("[141] getAuthRedirectUrl, providername :", providerName);
            var authUrl = getOrionAuthUrl(services);
            orionAuth = authUrl;
            logger.info("[144] orionAuth : " + orionAuth);
            var redirectUrl = getRedirectUrlForAuth(authUrl, username, providerName);
            redirectUrl += "&tid=" + tenantId; // add tenant id
            return redirectUrl;
        }

        function validate() {
            if (tenantId && discoveryUrl && username) {
                return true;
            }
            logger.error("auth request validation failed");
            return false;
        }

        function handleSuccess(redirectUrl) {
            logger.info("authentication: got the url.. ", redirectUrl);
            httpRes.redirect(redirectUrl);
        }

        function handleFailure(err) {
            logger.error("authentication: error occured during auth ", err);

            if (err.status && err.status == 503) {
                discoverGlobalServices();
                httpRes.sendStatus(503);
            }
            else
                httpRes.sendStatus(500);
        }

        this.processRequest = function () {
            if (!validate()) {
                httpRes.status(400).send('Missing mandatory params');
                return;
            }

            return discover()
                .then(getLocalProviderName)
                .then(getAuthRedirectUrl)
                .then(handleSuccess)
                .catch(handleFailure);
        }
    }

    function getOrionAuthUrl(services) {
        var url = getServiceUrl(services, config.orionUserAuth);
        if (!url) {
            discoverGlobalServices();
            throw new Error503("could not fetch orion auth url");
        }
        return url;
    }


    function getServiceUrl(services, service) {
        for (var s = 0; s < services.length; s++) {
            if (services[s].name == service.key) {
                logger.info("service", services[s].name, services[s].versions);
                var versions = services[s].versions;
                for (var v = 0; v < versions.length; v++) {
                    if (versions[v].version == service.version) {
                        logger.info(versions[v].url);
                        return versions[v].url;
                    }
                }
            }
        }
    }


    function discoverServices(tenantId, discoveryUrl) {
        logger.info("discoverServices " + discoveryUrl);
        var url = discoveryUrl + "?tid=" + tenantId;

        var options = {
            url: url,
            headers: {
                'referrer': config.host
            },
            json: true
        };

        return rp(options)
            .then(function (response) {
                return response.services;
            });
    }


    function checkAuthentication(req, res, next) {
        logger.info("Checking session " + req.sessionID + ", expired: " + req.session.cookie.expires + ". " + req.session.isAuth);
        if (!req.session.isAuth) {
            req.session.redirectURL = req.headers.referer;
            res.redirect(401, "/login");
        } else
            next();
    }

    function destroySession(req) {
        releaseLock(req);
        logger.info("release lock of policy by logout. " + req.sessionID);
        req.session.destroy();
    }

    function removeAuth(req, res, next) {
        destroySession(req);
        res.sendStatus(200);
    }

    var module = {
        routes: apiRoutes
    };


    var upgradePoliciesLockSession;

    function isOwnPolicyLock(req, res, next) {
        var sessionID = req.sessionID;
        logger.info("isOwnPolicyLock. lock:" + upgradePoliciesLockSession + ", session:" + sessionID);

        try {
            req.sessionStore.get(upgradePoliciesLockSession, (error, session) => {
                if (session) {
                    if (sessionID === upgradePoliciesLockSession) {
                        res.status(200).json(true);
                    } else {
                        res.sendStatus(403);
                    }
                } else {
                    logger.info("session lock empty or expired. " + upgradePoliciesLockSession);
                    res.status(200).json(false);
                }
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }

    function checkSessionLock(req, res, next) {
        if (!upgradePoliciesLockSession) {
            next();
            return;
        }
        logger.info("Check policy lock. " + req.originalUrl + ", lock:" + upgradePoliciesLockSession);
        try {
            req.sessionStore.get(upgradePoliciesLockSession, function (error, session) {
                if (!session) {
                    //If lock isn't empty, but isn't existed. Do load.
                    logger.info("session lock empty or expired. " + upgradePoliciesLockSession);
                    upgradePoliciesLockSession = undefined;
                    loadPolicy();
                }
                next();
            });
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }

    function tryPolicyLock(req, res, next) {
        if (req.method.toLowerCase() === 'get') {
            next();
            return;
        }

        var sessionID = req.sessionID;
        logger.info("tryPolicyLock. " + req.originalUrl + ", session:" + sessionID);
        //check session is available
        try {
            if (sessionID === upgradePoliciesLockSession || !upgradePoliciesLockSession) {
                logger.info("session is valid. [lock]:" + upgradePoliciesLockSession + ". [current session]:" +
                    sessionID + ". Expired:" + req.session.cookie.expires);
                next();
            } else {
                logger.error("lock is existed.");
                res.status(409).send("Others is operating policy and locked");
            }
        } catch (error) {
            logger.error(error);
            next(error);
        }
    }

    function getLock(req, res, next) {
        if (req.method.toLowerCase() !== 'get') {
            upgradePoliciesLockSession = req.sessionID;
            logger.info("Get lock: " + upgradePoliciesLockSession);
        }
        if (next)
            next();
    }

    function releaseLock(req, res) {
        //release lock if done.
        if (req.sessionID === upgradePoliciesLockSession) {
            logger.info("free lock: " + upgradePoliciesLockSession);
            upgradePoliciesLockSession = undefined;
            loadPolicy();
        }
    }

    function revertPolicy(req, res) {
        logger.info("revert change: " + upgradePoliciesLockSession);
        upgradePoliciesLockSession = undefined;
        loadPolicy(function (error) {
            if (error)
                res.status(500).send(error);
            else
                res.status(200).json('ok');
        });
    }

    function handlePolicyLoad(req, res, next) {
        if (!upgradePoliciesLockSession) {
            loadPolicy(function (error) {
                if (error)
                    res.status(500).send(error);
                else
                    res.status(200).json('ok');
            });
        }
    }

    function loadPolicy(callback) {
        try {
            logger.info("load policy.");
            var upgradeUrl = getServiceUrl(globalServices, constants.config.softUpgrade);
            if (upgradeUrl === undefined) {
                logger.error("Cannot get software upgrade url.");
            } else {
                var urlPath = upgradeUrl + '/load';

                request['post'](urlPath)
                    .send(new Object())
                    .query(new Object())
                    .end(function (err, resp) {
                        if (err) {
                            logger.error('error while /load request', {
                                err: err.response ? err.response.error : 'internal error',
                                urlPath: urlPath
                            });
                            if (callback)
                                callback(err);
                        } else {
                            logger.info('load policy done.');
                            if (callback)
                                callback(null);
                        }
                    });
            }
        } catch (err) {
            logger.error("Failed to load policy. " + err);
        }
    }

    function policyHandle(req, res, callback) {
        var upgradeUrl = '';

        if (upgradeUrl === undefined) {
            logger.error("Cannot get software upgrade url.");
            res.status(503).send("Cannot get software upgrade url.");
        } else {

            var urlPath = upgradeUrl + req.query.urlPath;
            delete req.query.urlPath;
            logger.info("policy handler. " + urlPath + " - " + req.method);

            request[req.method.toLowerCase()](urlPath)
                .send(req.body)
                .query(req.query)
                .end(function (err, resp) {
                    if (err) {
                        logger.error('error while superagent request', {
                            err: err.response ? err.response.error : 'internal error',
                            urlPath: urlPath
                        });
                        res.status(500).send(err);
                    } else {
                        res.status(resp.statusCode).json(resp.body);
                        if (callback) {
                            callback();
                        }
                    }
                });
        }
    }

    return module;
};
