const test = require('ava').test;
const Arrow = require('arrow');
const request = require('request');
const path = require('path');

var connector;
var auth;
var urlToHit;
var options;
var server

test.cb.before(t => {
	startServer();

	server.on('started', function () {
		auth = {
			user: server.config.apikey,
			password: ''
		},
			urlToHit = `http://localhost:${server.port}/api/`;

		t.end();
	});
});

test.cb.after(t => {
	server.stop();

	t.end();
});

test.cb('Should return proper status code when valid request is made', t => {
	options = {
		uri: urlToHit + 'message',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.true(body.success, "Body success should be true");
		t.deepEqual(response.statusCode, 200);

		t.end();
	});
});

test.cb('Should return proper response format when request is made to call endpoint', t => {
	const expectedProperties = []

	options = {
		uri: urlToHit + 'message',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		console.log(body);
		t.true(body.success, "Body success should be true");
		t.deepEqual(response.statusCode, 200);

		t.end();
	});
});

// 	request(options, function (err, response, body) {
// 		t.deepEqual(response.statusCode, 401);
// 		t.deepEqual(body.message, 'Unauthorized');
// 		t.false(body.success, 'With wrong auth body succes should be false');

// 		t.end();
// 	});
// });

// test.cb('Should make sure auth is required', t => {
// 	options = {
// 		uri: urlToHit,
// 		method: 'GET',
// 		json: true
// 	}

// 	request(options, function (err, response, body) {
// 		t.deepEqual(response.statusCode, 401);
// 		t.deepEqual(body.message, 'Unauthorized');
// 		t.false(body.success, 'With wrong auth body succes should be false');

// 		t.end();
// 	});
// });

function getConfiguration() {
	var files = path.join(process.cwd(), 'test/');
	var def_conf = files + 'conf/default.js';
	
	return require(def_conf);
}

function startServer(callback) {
	var def_conf = getConfiguration();
	// def_conf.port = 4000;
	def_conf.port = (Math.random() * 4000 + 1200) | 0;
	server = new Arrow(def_conf);
	connector = server.getConnector('appc.twilio');

	server.start(callback);
}
