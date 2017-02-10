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
const isNock = true;
const pluralize = require('pluralize');
const auth = {
	user: config.apikey_development,
	password: ''
};

test('Should delete a call if required parameters are passed', t => {
	const id = 'id';
	const modelName = 'call';
	const uri = `${urlToHit}/${modelName}/${id}`;
	const options = {
		uri: uri,
		method: 'DELETE',
		auth: auth,
		json: true
	};

	if (isNock) {
		nock(baseUrl)
			.delete(`${apiPrefix}/${modelName}/${id}`)
			.reply(204);
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 204, 'status code should be 204 deleted');

		t.end();
	});
});

test('Should delete a message if required parameters are passed', t => {
	const id = 'id';
	const modelName = 'message';
	const uri = `${urlToHit}/${modelName}/${id}`;
	const options = {
		uri: uri,
		method: 'DELETE',
		auth: auth,
		json: true
	};

	if (isNock) {
		nock(baseUrl)
			.delete(`${apiPrefix}/${modelName}/${id}`)
			.reply(204);
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 204, 'status code should be 204 deleted');

		t.end();
	});
});
