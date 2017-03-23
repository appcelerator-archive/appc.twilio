module.exports = {
  apikey_production: '01o7dmHvBC6WHSUbly0oSz8zRwAyYpkh',
  apikey_development: 'fEGSEpQf+azblUp5foJ7Lbh9szgg1U0J',
  apikey_preproduction: 'QEFSlW8dfL7jx8u7bkUK5FYWFBe6TEfK',
  APIKeyAuthType: 'basic',
  timeout: 120000,
  logLevel: 'error',
  logging: {
    logdir: './logs',
    transactionLogEnabled: true
  },
  apiPrefix: '/api',
  admin: {
    enabled: true,
    prefix: '/arrow',
    apiDocPrefix: '/apidoc',
    disableAuth: false,
    disableAPIDoc: false,
    disableDefault404: false,
    enableAdminInProduction: false
  },
  session: {
    encryptionAlgorithm: 'aes256',
    encryptionKey: 'Y5i7deY++92DaRc2Gxjaix6RMgsHQkb/DKUWxyDigbI=',
    signatureAlgorithm: 'sha512-drop256',
    signatureKey: 'm3VZ6fVAH+saVPGhbUKc5YEzKEQSHrpofUx9Z41bW1N5at54JRBXyq6gTdcvEa5qAbVlPG9QWQQNHhnaTlzRpA==',
    secret: 'nMbapMWSpLEfHBB/bPHr9xDxhTdv0pCk',
    duration: 86400000,
    activeDuration: 300000
  },
  cookieSecret: 'oWlkkkrUqPlp/fsMlG9RQkNtr6LO6Rj1',
  connectors: {
    'appc.twilio': {
      modelAutogen: true,
      generateModelsFromSchema: true,
      sid: '<SID>',
      auth_token: '<TOKEN>',
      twilio_number: '<NUMBER>'
    }
  }
}
