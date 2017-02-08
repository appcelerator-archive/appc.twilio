const test = require('ava').test;
const Arrow = require('arrow');
const request = require('request');
const path = require('path');
const config = require( '../server/config.js' );
const urlToHit = `http://localhost:${config.port}/api/`;
const auth = {
	user: config.apikey,
	password: ''
};
var options;

// test.cb.before(t => {
// 	startServer();

// 	server.on('started', function () {
// 		auth = {
// 			user: server.config.apikey,
// 			password: ''
// 		},
// 			urlToHit = `http://localhost:${server.port}/api/`;

// 		t.end();
// 	});
// });

// test.cb.after(t => {
// 	server.stop();

// 	t.end();
// });

test.cb('Should return proper status code when valid request is passed', (t, model = 'message', id = 'SM998f7c270098420b82fd7c2c32fe2832') => {
	options = {
		uri: `${urlToHit}${model}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);

		t.end();
	});
});

test.cb('Should return proper status code when valid request is passed to call endpoint', (t, model = 'call', id = 'CA8a3f92d936e485725f08b67a37bbcf89') => {
	options = {
		uri: `${urlToHit}${model}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(body.call.status, 'busy');
		t.is(body.call.price_unit, 'USD');
		t.is(body.call.duration, '0');

		t.end();
	});
});

test.cb('Should return proper response when correct ID is passed to message endpoint', (t, model = 'message', id = 'SM998f7c270098420b82fd7c2c32fe2832') => {
	options = {
		uri: `${urlToHit}${model}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		var message = body.message;

		t.true(body.success, "Body success should be true");
		t.is(response.statusCode, 200);
		t.is(message.sid, id);
		t.is(message.status, 'delivered');

		t.end();
	});
});

test.cb('Should return proper response when INVALID ID is passed', (t, model = 'message', id = '3') => {
	options = {
		uri: `${urlToHit}${model}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.false(body.success, "Body success should be false");
		t.is(response.statusCode, 500);
		t.is(body.message, `Could not find ${model} with ID: ${id}`);

		t.end();
	});
});

function getConfiguration() {
	var files = path.join(process.cwd(), 'test/');
	var def_conf = files + 'conf/default.js';

	return require(def_conf);
}

// function startServer(callback) {
// 	var def_conf = getConfiguration();
// 	def_conf.port = (Math.random() * 4000 + 1200) | 0;
// 	server = new Arrow(def_conf);
// 	connector = server.getConnector('appc.twilio');

// 	server.start(callback);
// }
