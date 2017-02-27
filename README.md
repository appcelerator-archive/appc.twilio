# Twilio Connector for Arrow
An Arrow connector for Twilio Node.js SDK v.2.11.1.

## 1. Installation
You can use 
```sh 
npm install appc.twilio
```
 or add 
```sh 
"appc.twilio" : "1.0.0"
``` 
to your **package.json** file.

## 2. Configuration
Register the connector in your **appc.json** file : 
```sh
"dependencies": {
    ...
    "connector/appc.twilio": "1.0.0"
    ...
  },
```
Set the configuration object in your ``conf/default.js`` file :
You need to set the following configuration properties:
```sh
    connectors: {
		'appc.twilio': {
			sid: '<youtTwilioAccountSID>',
			auth_token: '<yourTwilioAuthToken>',
			twilio_number: '<yourTwilioPhoneNumber>',
			modelAutogen: true
		}
    }
```
- **sid** - Your Twilio account sid
- **auth_token** - Your Twilio account auth_token
- **twilio_number** - Your Twilio phone number

## 3. Development
> This section is for individuals developing the Twilio Connector and not intended
  for end-users.

```sh
npm install
node app.js
```
Take a look at all available options and query parameters in the API documentation section of your arrow administration. Options are available under the group appc.twilio.

For development purposes use ``development`` branch only.

## 4. Testing
To test the connector, just run
```sh
npm test
```
To run just the `unit` tests run
```sh
npm run test:unit
```
To run just the `integration` tests run
```sh
npm run test:integration
```
**Note** that integration tests require setting the connector configuration object in your ``conf/default.js`` or in ``conf/local.js``