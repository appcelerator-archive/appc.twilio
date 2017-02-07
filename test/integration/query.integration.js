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

test.cb('Should return proper status code when valid request is passed', (t, model = 'call', where = '{"status": "busy"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
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

test.cb('Should return only calls with status busy', (t, model = 'call', where = '{"status": "busy"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);

		body.calls.map((call) => {
			t.is(call.status, 'busy');
		})

		t.end();
	});
});

test.cb('Should return proper response based on query parameters', (t, model = 'call', where = '{"status": "completed", "to": "+359899638562"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);

		body.calls.map((call) => {
			t.is(call.status, 'completed');
			t.is(call.to, '+359899638562');
		});

		t.end();
	});
});

test.cb('Should return NO response if there is no call to a given number', (t, model = 'call', where = '{"to": "+359271825"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(body.calls.length, 0);

		t.end();
	});
});

test.cb('Should return return all calls on the date passed in the query parameters', (t, model = 'call', where = '{"startTime": "2017-01-31"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}
	var expectedCallTime = '31 Jan 2017';

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(typeof body.calls, 'object');

		body.calls.map((call) => {
			// If start time is correct should be true
			t.true(call.start_time.indexOf(expectedCallTime) !== -1);
		});

		t.end();
	});
});

test.cb('Should return return all messages to a given number', (t, model = 'message', where = '{"to": "+359899982932"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(typeof body.messages, 'object');

		body.messages.map((message) => {
			t.is(message.to, '+359899982932');
		});

		t.end();
	});
});

test.cb('Should return return all messages to a given number and date', (t, model = 'message', where = '{"to": "+359899982932", "DateSent": "Thu, 26 Jan 2017"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}
	var expectedMessageDate = 'Thu, 26 Jan 2017';

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(typeof body.messages, 'object');

		body.messages.map((message) => {
			t.is(message.to, '+359899982932');
			t.true(message.date_sent.indexOf(expectedMessageDate) !== -1);
		});

		t.end();
	});
});

test.cb('Should return return all if no query parameters are passed', (t, model = 'call') => {
	options = {
		uri: `${urlToHit}${model}/query?`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(typeof body.calls, 'object');

		t.end();
	});
});

test.cb('Should return all addresses with friendly name "The Simpsons" ', (t, model = 'address', where = '{"friendlyName": "The Simpsons"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);

		body.addresses.map((address) => {
			t.is(address.friendlyName, 'The Simpsons');
		});
		
		t.end();
	});
});

test.cb('Should return NO address when there is no such address based on the query parameters', (t, model = 'address', where = '{"friendlyName": "The Simpsons", "customerName": "Homer"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(body.addresses.length, 0);

		t.end();
	});
});

test.cb('Should return return no results if there is no outgoing caller id with this phone number', (t, model = 'outgoingcallerid', where = '{"phoneNumber": "+16467625508"}') => {
	options = {
		uri: `${urlToHit}${model}/query?where=${where}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.falsy(err);
		t.true(body.success);
		t.is(response.statusCode, 200);
		t.is(body.outgoingcallerids.length, 0);

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
	def_conf.port = (Math.random() * 4000 + 1200) | 0;
	server = new Arrow(def_conf);
	connector = server.getConnector('appc.twilio');

	server.start(callback);
}
