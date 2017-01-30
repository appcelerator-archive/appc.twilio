/**
 * this is your configuration file defaults.
 *
 * You can create additional configuration files to that the server will load based on your
 * environment.  For example, if you want to have specific settings for production which are different
 * than your local development environment, you can create a production.js and a local.js.  Any changes
 * in those files will overwrite changes to this file (a object merge is performed). By default, your
 * local.js file will not be commited to git or the registry.
 *
 * This is a JavaScript file (instead of JSON) so you can also perform logic in this file if needed.
 */
module.exports = {
	// these are your generated API keys.  They were generated uniquely when you created this project.
	// DO NOT SHARE these keys with other projects and be careful with these keys since they control
	// access to your API using the default configuration.  if you don't want two different keys for
	// production and test (not recommended), use the key 'apikey'.  To simulate running in production,
	// set the environment variable NODE_ENV to production before running such as:
	//
	// NODE_ENV=production appc run
	//
	// production key, this is the key that will be required when you are running in production
	apikey_production: '01o7dmHvBC6WHSUbly0oSz8zRwAyYpkh',
	// development key, this is the key that will be required when you are testing non-production (such as locally)
	apikey_development: 'fEGSEpQf+azblUp5foJ7Lbh9szgg1U0J',
	// preproduction key, this is the key that will be required when you are testing non-production (such as locally)
	apikey_preproduction: 'QEFSlW8dfL7jx8u7bkUK5FYWFBe6TEfK',

	// by default the authentication strategy is 'basic' which will use HTTP Basic Authorization where the
	// usename is the key and the password is blank.  the other option is 'apikey' where the value of the
	// APIKey header is the value of the key.  you can also set this to 'plugin' and define the key 'APIKeyAuthPlugin'
	// which points to a file or a module that implements the authentication strategy
	APIKeyAuthType: 'basic',

	// The number of milliseconds before timing out a request to the server.
	timeout: 120000,

	// logging configuration
	logLevel: 'debug', // Log level of the main logger.
	logging: {
		// location of the logs if enabled
		logdir: './logs',
		// turn on transaction logs
		transactionLogEnabled: true
	},

	// prefix to use for apis
	apiPrefix: '/api',

	// control the settings for the admin website
	admin: {
		// control whether the admin website is available
		enabled: true,
		// the prefix to the admin website
		prefix: '/arrow',
		// the prefix for the public apidocs website
		apiDocPrefix: '/apidoc',
		// if you set disableAuth, in production only your API docs will show up
		disableAuth: false,
		// if you set disableAPIDoc, your API docs will not show up (regardless of disableAuth)
		disableAPIDoc: false,
		// if you set disableDefault404, Arrow will not register a default 404 handler
		disableDefault404: false,
		// set to true to allow the admin website to be accessed in production. however, you will still need a
		// login unless disableAuth is false. if you set this to false, the admin website will not be enabled
		// when in production (still respects enabled above)
		enableAdminInProduction: false,
		// set the email addresses you want to be able to log in to the admin website
		validEmails: ["tpopov@axway.com"],
		// set the organization ids you want to be able to log in to the admin website
		validOrgs: [100094705]
	},

	// you can generally leave this as-is since it is generated for each new project you created.
	session: {
		encryptionAlgorithm: 'aes256',
		encryptionKey: 'Y5i7deY++92DaRc2Gxjaix6RMgsHQkb/DKUWxyDigbI=',
		signatureAlgorithm: 'sha512-drop256',
		signatureKey: 'm3VZ6fVAH+saVPGhbUKc5YEzKEQSHrpofUx9Z41bW1N5at54JRBXyq6gTdcvEa5qAbVlPG9QWQQNHhnaTlzRpA==',
		secret: 'nMbapMWSpLEfHBB/bPHr9xDxhTdv0pCk', // should be a large unguessable string
		duration: 86400000, // how long the session will stay valid in ms
		activeDuration: 300000 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	},

	// if you want signed cookies, you can set this value. if you don't want signed cookies, remove or make null
	cookieSecret: 'oWlkkkrUqPlp/fsMlG9RQkNtr6LO6Rj1',

	// your connector configuration goes here
	connectors: {
		'appc.twilio': {
			sid: "ACef0b57d41aae77d8b1dd5592b172b780",
			auth_token: "ff8db352ee37b5fd3990389148fe65eb",
			twilio_number: "+18329240322",
			modelAutogen: true
		}
	}
};