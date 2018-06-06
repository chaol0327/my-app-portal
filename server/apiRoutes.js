module.exports = function (config) {
    var orionAuth = '';

    const express = require('express'),
        apiRoutes = express.Router(),
        request = require('superagent'),
        rp = require("request-promise");

    //API routes
    apiRoutes.all('/callAPI/*', handleRequest);
    apiRoutes.post('/import/:path', uploadFile);

    var logger = require('bunyan').createLogger({name: "apiRoutes", type: "component"});

    const apiHost = "http://10.250.54.74:12378";
    function handleRequest(req, res) {
        const option = {
            method: req.method.toUpperCase(),
            uri: `${apiHost}/${req.params[0]}`,
            qs: req.query,
            body: req.body,
            json: true // Automatically stringifies the body to JSON
        };
        return rp(option).then((data) =>{
            res.status(200).json(data);
        }).catch((error) => {
            res.status(500).send({error});
        });
    }

    function uploadFile(req, res) {
        const request = req;
        // req.files['record'].mv('./test.csv', function (error) {
        //     if(error){
        //         console.error(error);
        //         res.sendStatus(500);
        //     }
        //     else{
        //         res.sendStatus(200);
        //     }
        // });
        const options = {
            method: 'POST',
            uri: `${apiHost}/${req.params.path}`,
            formData: {
                // Like <input type="text" name="name">
                name: 'file',
                // Like <input type="file" name="file">
                file: {
                    value: req.files['record']['data'],
                    options: {
                        filename: req.files['record']['name'],
                        contentType: req.files['record']['mimetype']
                    }
                }
            },
            headers: {
                'content-type': 'multipart/form-data'   // Is set automatically
            }
        };
        rp(options)
            .then(function (body) {
                console.dir(body);
                res.status(200).json(body);
                // POST succeeded...
            })
            .catch(function (err) {
                // POST failed...
                res.status(500).json(err);
            });
    }

    return module;
};
