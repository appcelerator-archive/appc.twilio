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

test('Should go through with auth alright', function (t) {
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

		t.end();
	});
});

test('Should fail with wrong auth params', function (t) {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: {
			user: 'John',
			password: 'Invalid'
		},
		json: true
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 401, 'status code should be 401');
		t.equal(body.message, 'Unauthorized');
		t.notOk(body.success, 'With wrong auth body succes should be false');

		t.end();
	});
});

test('Should make sure auth is required', function (t) {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		json: true
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 401, 'status code should be 401');
		t.equal(body.message, 'Unauthorized');
		t.notOk(body.success, 'With wrong auth body succes should be false');

		t.end();
	});
});
