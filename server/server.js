const https =  require("https"),
    http = require("http"),
    express = require('express'), 
    app = express(),
    path = require('path'),
    compression = require('compression'),
    bodyParser  =  require("body-parser"),
    cookieParser = require('cookie-parser'),
    session = require('express-session');


process.on('SIGINT', function () {
    console.info('Got SIGINT.  Exiting.');
    cleanUp();
});

process.on('SIGTERM', function () {
    console.info('Got SIGTERM.  Exiting.');
    cleanUp();
});

process.on('uncaughtException', function (err) {
    console.error("uncaughtException");
    console.error(err.stack);
    cleanUp();
});

function cleanUp() {
    setTimeout(function () {
        process.exit(1);
    }, 1000);
}

    app.rootPath = path.join(__dirname, '../client/build/');


    app.use(compression());
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ extended: false })); // to support URL-encoded bodies
    app.use(cookieParser("test key"));
    app.use(session({
        cookie:{maxAge: 30 * 60 * 1000, secure: true, httpOnly: true},
        secret: "test key",
        resave: false,
        rolling: true,
        saveUninitialized: false
    }));

    //API routes
    var apiRoutes = require("./apiRoutes")({});
    app.use('/api',apiRoutes.routes);

    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: app.rootPath });
    });

    var httpServer = http.createServer(app).listen(8080);
    console.info("HTTP Server started on port 8080");


