const test = require( 'tape' );
const request = require( 'request' );
const path = require( 'path' );
const config = require( '../server/config.js' );
const port = config.port || 8080;
const baseUrl = `http://localhost:${port}`;
const apiPrefix = '/api';
const urlToHit = `${baseUrl}${apiPrefix}`;

const auth = {
	user: config.apikey_development,
	password: ''
};
const tapSpec = require( 'tap-spec' );
test.createStream()
	.pipe( tapSpec() )
	.pipe( process.stdout );

const nock = require( 'nock' );


test( 'Should return proper status code when valid request is made', function ( t ) {
	const modelName = '/message';

	if (config.mockAPI) {
		nock( baseUrl )
			.get( `${apiPrefix}${modelName}` )
			.reply( 200, { success: true });
	}

	const uri = `${urlToHit}${modelName}`;
	const options = {
		uri: uri,
		method: 'GET',
		auth: auth,
		json: true
	}
	request( options, function ( err, response, body ) {
		t.ok( body.success, "Body success should be true" );
		t.equal( response.statusCode, 200 );
		t.end();
	});
});

// test( 'Should return proper response when INVALID find all request is made', function ( t ) {
// 	const options = {
// 		uri: urlToHit + 'invalid',
// 		method: 'GET',
// 		auth: auth,
// 		json: true
// 	}

// 	request( options, function ( err, response, body ) {
// 		t.notOk( body.success, "Body success should be false when invalid request is made" );
// 		t.equal( response.statusCode, 404 );
// 		t.equal( body.error, 'Not found' );

// 		t.end();
// 	});
// });

// test( 'Should return proper response format when request is made to message endpoint', function ( t ) {
// 	const expectedProperties = ['id',
// 		'sid',
// 		'date_created',
// 		'date_updated',
// 		'date_sent',
// 		'account_sid',
// 		'to',
// 		'from',
// 		'body',
// 		'status',
// 		'num_segments',
// 		'num_media',
// 		'direction',
// 		'api_version',
// 		'price',
// 		'price_unit',
// 		'uri',
// 		'subresource_uris'];

// 	options = {
// 		uri: urlToHit + 'message',
// 		method: 'GET',
// 		auth: auth,
// 		json: true
// 	}

// 	request( options, function ( err, response, body ) {
// 		t.ok( body.success, "Body success should be true" );
// 		t.equal( response.statusCode, 200 );

// 		body.messages.map(( item ) => {
// 			var properties = Object.getOwnPropertyNames( item );

// 			t.deepEqual( properties, expectedProperties, 'Each item should have the same properties as the message model' );
// 		});

// 		t.end();
// 	});
// });

// test( 'Should return proper response format when request is made to call endpoint', function ( t ) {
// 	const expectedProperties = ['id',
// 		'sid',
// 		'date_created',
// 		'to',
// 		'from',
// 		'from_formatted',
// 		'phone_number_sid',
// 		'status',
// 		'start_time',
// 		'end_time',
// 		'duration',
// 		'price_unit',
// 		'direction',
// 		'api_version',
// 		'uri',
// 		'subresource_uris'];

// 	options = {
// 		uri: urlToHit + 'call',
// 		method: 'GET',
// 		auth: auth,
// 		json: true
// 	}

// 	request( options, function ( err, response, body ) {
// 		t.ok( body.success, "Body success should be true" );
// 		t.equal( response.statusCode, 200 );

// 		body.calls.map(( call ) => {
// 			var properties = Object.getOwnPropertyNames( call );

// 			// Check if call has required and auto generated properties
// 			expectedProperties.map(( prop ) => {
// 				t.true( call.hasOwnProperty( prop ) );
// 			});
// 		});

// 		t.end();
// 	});
// });

// test( 'Should return result in proper format', function ( t ) {
// 	const options = {
// 		uri: urlToHit + 'recording',
// 		method: 'GET',
// 		auth: auth,
// 		json: true
// 	}

// 	request( options, function ( err, response, body ) {
// 		t.ok( body.success, "Body success should be true" );
// 		t.equal( response.statusCode, 200 );
// 		t.equal( typeof body.recordings, 'object' );

// 		t.end();
// 	});
// });

// test( 'Should return NON empty result', function ( t ) {
// 	const options = {
// 		uri: urlToHit + 'call',
// 		method: 'GET',
// 		auth: auth,
// 		json: true
// 	}

// 	request( options, function ( err, response, body ) {
// 		t.ok( body.success, "Body success should be true" );
// 		t.equal( response.statusCode, 200 );
// 		t.equal( typeof body.calls, 'object' );
// 		t.ok( body.calls.length > 0 );

// 		t.end();
// 	});
// });

// test( 'Should return proper response format when request is made to address endpoint', function ( t ) {
// 	const expectedProperties = ['id',
// 		'sid',
// 		'friendlyName',
// 		'customerName',
// 		'street',
// 		'city',
// 		'region',
// 		'postalCode',
// 		'isoCountry'];

// 	const options = {
// 		uri: urlToHit + 'address',
// 		method: 'GET',
// 		auth: auth,
// 		json: true
// 	}

// 	request( options, function ( err, response, body ) {
// 		t.ok( body.success, "Body success should be true" );
// 		t.equal( response.statusCode, 200 );

// 		body.addresses.map(( address ) => {
// 			var properties = Object.getOwnPropertyNames( address );

// 			t.deepEqual( properties, expectedProperties, 'Each item should have the same properties as the message model' );
// 		});

// 		t.end();
// 	});
// });
