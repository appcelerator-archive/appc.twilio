const test = require('tape');
const request = require('request');
const config = require('../server/config.js');
const nock = require('nock');
const port = config.port || 8080;
const baseUrl = `http://localhost:${port}`;
const apiPrefix = '/api';
const urlToHit = `${baseUrl}${apiPrefix}`;
const auth = {
	user: config.apikey_development,
	password: ''
};

test('Should return proper status code when valid request is passed', t => {
	const id = 'SM998f7c270098420b82fd7c2c32fe2832';
	const modelName = 'message';
	const uri = `${urlToHit}/${modelName}`;
	const options = {
		uri: `${uri}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}/${modelName}/${id}`)
			.reply(200, { success: true })
	}

	request(options, function (err, response, body) {
		t.notOk(err);
		t.ok(body.success);
		t.equal(response.statusCode, 200, 'statusCode should be 200');

		t.end();
	});
});

test('Should return proper status code when valid request is passed to call endpoint', t => {
	const modelName = 'call';
	const uri = `${urlToHit}/${modelName}`;
	const id = 'CA8a3f92d936e485725f08b67a37bbcf89';
	const options = {
		uri: `${uri}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}/${modelName}/${id}`)
			.reply(200, {
				success: true,
				call: {
					status: 'busy',
					price_unit: 'USD',
					duration: '0'
				}
			});
	}

	request(options, function (err, response, body) {
		t.notOk(err);
		t.ok(body.success);
		t.equal(response.statusCode, 200, 'status code should be 200');
		t.equal(body.call.status, 'busy');
		t.equal(body.call.price_unit, 'USD');
		t.equal(body.call.duration, '0');

		t.end();
	});
});

test('Should return proper response when correct ID is passed to message endpoint', t => {
	const modelName = 'message';
	const uri = `${urlToHit}/${modelName}`;
	const id = 'SM998f7c270098420b82fd7c2c32fe2832';
	const options = {
		uri: `${uri}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}/${modelName}/${id}`)
			.reply(200, {
				success: true,
				message: {
					sid: id,
					status: 'delivered'
				}
			});
	}

	request(options, function (err, response, body) {
		var message = body.message;

		t.ok(body.success, "Body success should be true");
		t.equal(response.statusCode, 200, 'status code should be 200');
		t.equal(message.sid, id);
		t.equal(message.status, 'delivered');

		t.end();
	});
});

test('Should return proper response when INVALID ID is passed', t => {
	const modelName = 'message';
	const uri = `${urlToHit}/${modelName}`;
	const id = 3;
	const options = {
		uri: `${uri}/${id}`,
		method: 'GET',
		auth: auth,
		json: true
	}

	if (config.mockAPI) {
		nock(baseUrl)
			.get(`${apiPrefix}/${modelName}/${id}`)
			.reply(500, {
				success: false,
				message: `Could not find ${modelName} with ID: ${id}`
			});
	}

	request(options, function (err, response, body) {
		t.notOk(body.success, "Body success should be false");
		t.equal(response.statusCode, 500);
		t.equal(body.message, `Could not find ${modelName} with ID: ${id}`);

		t.end();
	});
});
