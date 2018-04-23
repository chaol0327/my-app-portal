const https =  require("https"),
    http = require("http"),
    express = require('express'), 
    app = express(),
    path = require('path'),
    compression = require('compression'),
    bodyParser  =  require("body-parser");


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
    reg.unregister();
    setTimeout(function () {
        process.exit(1);
    }, 1000);
}

    app.rootPath = path.join(__dirname, '../client/build/');


    app.use(compression());
    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({ extended: false })); // to support URL-encoded bodies

    //API routes
    // var apiRoutes = require("./apiRoutes")(config, reg.consul());
    // app.use('/api',apiRoutes.routes);

    app.get('*', function(req, res) {
        res.sendFile('index.html', { root: app.rootPath });
    });

    var httpServer = http.createServer(app).listen(8080);
    console.info("HTTP Server started on port 8080");


