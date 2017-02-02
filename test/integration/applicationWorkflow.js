/* global Arrow, connector, server */
'use strict';

require('./../_init');

// import test from 'ava';
const test = require('ava').test;
const Arrow = require('arrow');
const request = require('request');
const path = require('path');
var a,
	connector,
	auth,
	urlToHit,
	options;

test.cb.before(t => {
	server.on('started', function () {
		console.log("start");
		auth = {
			user: server.config.apikey,
			password: ''
		},
			urlToHit = 'http://localhost:' + server.port + '/api/message';

		options = {
			uri: urlToHit,
			method: 'GET',
			auth: auth,
			json: true
		}

		t.end();
	});
});

// test('foo', t => {
// });

// test('bar', t => {
// 	t.deepEqual(a, a);
// });

test.cb('Application workflow tests', t => {
	//console.log(options);
	request(options, function (err, response, body) {
		//console.log("RESP", response);
		t.deepEqual(response.statusCode, 200);

		t.end();
	});


})
