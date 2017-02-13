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

test('Should go through with auth alright', t => {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}${modelName}`)
			.reply(200, { success: true });
	}

	request(options, function (err, response, body) {
		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');

		nock.cleanAll();
		t.end();
	});
});

test('Should fail with wrong auth params', t => {
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

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}${modelName}`)
			.reply(401, { success: false, message: 'Unauthorized' });
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 401, 'status code should be 401');
		t.equal(body.message, 'Unauthorized');
		t.notOk(body.success, 'With wrong auth body succes should be false');

		nock.cleanAll();
		t.end();
	});
});

test('Should make sure auth is required', t => {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		json: true
	}

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}${modelName}`)
			.reply(401, { success: false, message: 'Unauthorized' });
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 401, 'status code should be 401');
		t.equal(body.message, 'Unauthorized');
		t.notOk(body.success, 'With wrong auth body succes should be false');

		t.end();
	});
});