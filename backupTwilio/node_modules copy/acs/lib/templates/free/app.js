'use strict';

var express = require('express'),
	// restify = require('restify'),
	Logger = require('appc-logger');

var expressApp = express(),
	expressLogger = Logger.createHttpLogger(expressApp, 'express');

expressApp.get('/', function(req, res) {
	expressLogger.info('Hello world from Arrow Cloud logger.');
	res.send('Welcome to Appcelerator Arrow Cloud!');
});
expressApp.get('/hello/:world', function(req, res) {
	expressLogger.info('Hello world from Arrow Cloud logger. Hello ' + req.params.world + '!');
	res.send('Welcome to Appcelerator Arrow Cloud! Hello ' + req.params.world + '!');
});
expressApp.get('/ping.json', function(req, res) {
	res.send({
		ping: true
	});
});

var expressServer = expressApp.listen(process.env.PORT || 8080, function() {
	var host = expressServer.address().address;
	var port = expressServer.address().port;
	console.log('Arrow Cloud server listening at http://%s:%s', host, port);
});

// var restifyServer = restify.createServer({
// 		name: 'Arrow Cloud Server',
// 		version: '1.0.0'
// 	}),
// 	restifyLogger = Logger.createHttpLogger(restifyServer, 'restify');

// restifyServer.get('/', function(req, res, next) {
// 	restifyLogger.info('Hello world from Arrow Cloud logger.');
// 	res.send('Welcome to Appcelerator Arrow Cloud!');
// 	return next();
// });
// restifyServer.get('/hello/:world', function(req, res, next) {
// 	restifyLogger.info('Hello world from Arrow Cloud logger. Hello ' + req.params.world + '!');
// 	res.send('Welcome to Appcelerator Arrow Cloud! Hello ' + req.params.world + '!');
// 	return next();
// });
// restifyServer.listen(process.env.PORT || 8080, function() {
// 	console.log('%s listening at %s', restifyServer.name, restifyServer.url);
// });
