/* jshint node: true, esversion: 6 */
'use strict';

const express = require('express'),
    cors = require('cors'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    { checkVariable } = require('@fcsr/env');

const apply = require('./context');

const PORT = 3000,
    DAL_HOSTNAME = checkVariable('DAL_HOSTNAME'),
    DAL_PORT = checkVariable('DAL_PORT');

let app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

apply(app, {DAL_HOSTNAME, DAL_PORT});

app.use(handleError);

const server = app.listen(PORT, function () {
    console.log('CAF API server for Scenario 2 started on: ' + PORT);
});

function handleError(err, req, res, next) {
    console.error(err);
    res.sendStatus(500);
}

process.on('SIGTERM', function () {
    server.close(function () {
        process.exit();
    });
});

process.on('SIGINT', function () {
    server.close(function () {
        process.exit();
    });
});
