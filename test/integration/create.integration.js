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

test('Should create a call if required parameters are passed', t => {
	const modelName = 'call';
	const uri = `${urlToHit}/${modelName}`;
	const options = {
		uri: uri,
		method: 'POST',
		body: {
			to: '+359899638562'
		},
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.post(`${apiPrefix}/${modelName}`, {
				to: '+359899638562'
			})
			.reply(201);
	}

	request(options, function (err, response, body) {
		t.equal(response.statusCode, 201, 'status code should be 201 created');

		t.end();
	});
});

test('Should NOT create a call if required parameters are not passed', t => {
	const modelName = '/call';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'POST',
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.post(`${apiPrefix}${modelName}`)
			.reply(400, { success: false });
	}

	request(options, function (err, response, body) {
		t.notOk(body.success, "Body success should be false");
		t.equal(response.statusCode, 400, 'status code should be 400');

		t.end();
	});
});

test('Should create a message if required parameters are passed', t => {
	const modelName = '/message';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'POST',
		body: {
			to: '+359899638562',
			body: 'Hi there !'
		},
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.post(`${apiPrefix}${modelName}`, {
				to: '+359899638562',
				body: 'Hi there !'
			})
			.reply(201);
	}

	request(options, function (err, response, body) {
		const reqBody = JSON.parse(response.request.body);

		t.equal(response.statusCode, 201, 'status code should be 201');
		t.equal(reqBody.to, '+359899638562');
		t.equal(reqBody.body, 'Hi there !');

		t.end();
	});
});

test('Should create an address if required parameters are passed', t => {
	const modelName = '/address';
	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'POST',
		body: {
			friendlyName: 'Test Address',
			customerName: 'Test',
			street: 'Some beautiful street',
			city: 'Racoon City',
			region: 'CA',
			postalCode: '12345',
			isoCountry: 'US'
		},
		auth: auth,
		json: true
	};

	if (config.mockAPI) {
		nock(baseUrl)
			.post(`${apiPrefix}${modelName}`, {
				friendlyName: 'Test Address',
				customerName: 'Test',
				street: 'Some beautiful street',
				city: 'Racoon City',
				region: 'CA',
				postalCode: '12345',
				isoCountry: 'US'
			})
			.reply(201);
	}

	request(options, function (err, response, body) {
		const reqBody = JSON.parse(response.request.body);

		t.equal(response.statusCode, 201, 'status code should be 201');
		t.equal(reqBody.customerName, 'Test');
		t.equal(reqBody.region, 'CA');

		nock.cleanAll();
		t.end();
	});
});
