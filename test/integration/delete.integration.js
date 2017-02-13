const test = require('tape');
const request = require('request');
const config = require('../server/config.js');
const nock = require('nock');
const port = config.port || 8080;
const baseUrl = `http://localhost:${port}`;
const apiPrefix = '/api';
const mocks = require('./mocks/mocks');
const urlToHit = `${baseUrl}${apiPrefix}`;
const pluralize = require('pluralize');
const auth = {
	user: config.apikey_development,
	password: ''
};
var id;

test('Should get last call id to delete it', t => {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	if(config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}${modelName}`)
			.reply(200, mocks.call)
	}

	request(options, function (err, response, body) {
		id = body.calls[0].sid;
		t.ok(body.success);

		nock.cleanAll();
		t.end();
	});
});

test('Should delete a call if required parameters are passed', t => {
	const modelName = 'call';
	const uri = `${urlToHit}/${modelName}/${id}`;
	const options = {
		uri: uri,
		method: 'DELETE',
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.delete(`${apiPrefix}/${modelName}/${id}`)
			.reply(204);
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 204, 'status code should be 204 deleted');

		nock.cleanAll();
		t.end();
	});
});

test('Should get last message id to delete it', t => {
	const modelName = '/message';

	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}

	if(config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}${modelName}`)
			.reply(200, mocks.message);
	}

	request(options, function (err, response, body) {
		id = body.messages[0].sid;
		t.ok(body.success);

		t.end();
	});
});

test('Should delete a message if required parameters are passed', t => {
	const modelName = 'message';
	const uri = `${urlToHit}/${modelName}/${id}`;
	const options = {
		uri: uri,
		method: 'DELETE',
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.delete(`${apiPrefix}/${modelName}/${id}`)
			.reply(204);
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 204, 'status code should be 204 deleted');

		nock.cleanAll();
		t.end();
	});
});

test('Should NOT delete if id param is not valid', t => {
	const modelName = 'message';
	const uri = `${urlToHit}/${modelName}/invalid`;
	const options = {
		uri: uri,
		method: 'DELETE',
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.delete(`${apiPrefix}/${modelName}/invalid`)
			.reply(500, { success: false, message: 'Could not find message with ID: invalid' });
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 500, 'status code should be 500 not found');
		t.equal(body.success, false);
		t.equal(body.message, 'Could not find message with ID: invalid', `Error message is correct`);

		nock.cleanAll();
		t.end();
	});
});
