const test = require('tape');
const request = require('request');
const path = require('path');
const config = require('../server/config.js');
const nock = require('nock');
const tapSpec = require('tap-spec');
const port = config.port || 8080;
const baseUrl = `http://localhost:${port}`;
const apiPrefix = '/api';
const urlToHit = `${baseUrl}${apiPrefix}`;
const auth = {
	user: config.apikey_development,
	password: ''
};

test('Should return proper status code when valid request is made', t => {
	const modelName = '/message';

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}${modelName}`)
			.reply(200, { success: true });
	}

	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}
	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');
		t.end();
	});
});

test('Should return proper response when INVALID find all request is made', t => {
	const modelName = '/invalid';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.notOk(body.success, "Body success should be false when invalid request is made");
		t.equal(response.statusCode, 404, 'status code should be 404');
		t.equal(body.error, 'Not found');

		t.end();
	});
});

test('Should return proper response format when request is made to message endpoint', t => {
	const modelName = '/message';
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

	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');

		body.messages.map((item) => {
			var properties = Object.getOwnPropertyNames(item);

			t.deepEqual(properties, expectedProperties, `Each item should have the same properties as the ${modelName} model`);
		});

		t.end();
	});
});

test('Should return proper response format when request is made to call endpoint', t => {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
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

	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');

		body.calls.map((call) => {
			var properties = Object.getOwnPropertyNames(call);

			// Check if call has required and auto generated properties
			expectedProperties.map((prop) => {
				t.ok(call.hasOwnProperty(prop), `Each item should have the same properties as the ${modelName} model`);
			});
		});

		t.end();
	});
});

test('Should return proper response format when request is made to address endpoint', t => {
	const modelName = '/address';
	const uri = `${urlToHit}${modelName}`;
	const expectedProperties = ['id',
		'sid',
		'customerName',
		'street',
		'city',
		'region',
		'postalCode',
		'isoCountry'];

	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');

		body.addresses.map((address) => {
			var properties = Object.getOwnPropertyNames(address);

			expectedProperties.map((prop) => {
				t.ok(address.hasOwnProperty(prop), `Each item should have the same properties as the ${modelName} model`);
			});
		});

		t.end();
	});
});

test('Should return result in proper format', t => {
	const modelName = '/recording';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');
		t.equal(typeof body.recordings, 'object');

		t.end();
	});
});

test('Should return NON empty result', t => {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');
		t.equal(typeof body.calls, 'object');
		t.ok(body.calls.length > 0);

		t.end();
	});
});
