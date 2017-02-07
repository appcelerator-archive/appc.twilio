const test = require('ava').test;
const Arrow = require('arrow');
const request = require('request');
const path = require('path');

var connector;
var auth;
var urlToHit;
var options;
var server;

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
		t.is(response.statusCode, 200);

		t.end();
	});
});

test.cb('Should return proper response when INVALID find all request is made', t => {
	options = {
		uri: urlToHit + 'invalid',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.false(body.success, "Body success should be false when invalid request is made");
		t.is(response.statusCode, 404);
		t.is(body.error, 'Not found');

		t.end();
	});
});

test.cb('Should return proper response format when request is made to message endpoint', t => {
	const expectedProperties = ['id',
		'sid',
		'date_created',
		'date_updated',
		'date_sent',
		'account_sid',
		'to',
		'from',
		'body',
		'status',
		'num_segments',
		'num_media',
		'direction',
		'api_version',
		'price',
		'price_unit',
		'uri',
		'subresource_uris'];

	options = {
		uri: urlToHit + 'message',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.true(body.success, "Body success should be true");
		t.is(response.statusCode, 200);

		body.messages.map((item) => {
			var properties = Object.getOwnPropertyNames(item);

			t.deepEqual(properties, expectedProperties, 'Each item should have the same properties as the message model');
		});

		t.end();
	});
});

test.cb('Should return proper response format when request is made to call endpoint', t => {
	const expectedProperties = ['id',
		'sid',
		'date_created',
		'to',
		'from',
		'from_formatted',
		'phone_number_sid',
		'status',
		'start_time',
		'end_time',
		'duration',
		'price_unit',
		'direction',
		'api_version',
		'uri',
		'subresource_uris'];

	options = {
		uri: urlToHit + 'call',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.true(body.success, "Body success should be true");
		t.is(response.statusCode, 200);

		body.calls.map((call) => {
			var properties = Object.getOwnPropertyNames(call);

			// Check if call has required and auto generated properties
			expectedProperties.map((prop) => {
				t.true(call.hasOwnProperty(prop));
			});
		});

		t.end();
	});
});

test.cb('Should return result in proper format', t => {
	options = {
		uri: urlToHit + 'recording',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.true(body.success, "Body success should be true");
		t.is(response.statusCode, 200);
		t.is(typeof body.recordings, 'object');

		t.end();
	});
});

test.cb('Should return NON empty result', t => {
	options = {
		uri: urlToHit + 'call',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.true(body.success, "Body success should be true");
		t.is(response.statusCode, 200);
		t.is(typeof body.calls, 'object');
		t.true(body.calls.length > 0);

		t.end();
	});
});

test.cb('Should return proper response format when request is made to address endpoint', t => {
	const expectedProperties = ['id',
		'sid',
		'friendlyName',
		'customerName',
		'street',
		'city',
		'region',
		'postalCode',
		'isoCountry'];

	options = {
		uri: urlToHit + 'address',
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.true(body.success, "Body success should be true");
		t.is(response.statusCode, 200);

		body.addresses.map((address) => {
			var properties = Object.getOwnPropertyNames(address);

			t.deepEqual(properties, expectedProperties, 'Each item should have the same properties as the message model');
		});

		t.end();
	});
});

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
