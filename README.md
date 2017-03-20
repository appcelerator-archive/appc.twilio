# Twilio Connector for Arrow
An Arrow connector for Twilio Node.js SDK v.2.11.1.

## 1. Installation
```sh 
appc install connector/appc.twilio
```

## 2. Configuration
Set the configuration object in your ``conf/appc.twilio.default.js`` file.

You need to set the following configuration properties:
```sh
    connectors: {
      'appc.twilio': {
        skipModelNamespace: '<DEFAULT IS TRUE SO MODEL WILL NOT BE NAMESPACED>',
        modelNamespace: '<OPTIONAL. THIS IS THE WAY WE CAN OVERRIDE THE DEFAULT NAMESPACE WHICH IS THE CONNECTOR NAME.>',
        sid: '<MANDATORY. YOUR TWILLIO ACCOUNT SID>',
        auth_token: '<MANDATORY. YOUR TWILLIO ACCOUNT TOKEN>',
        twilio_number: '<MANDATORY. YOUR TWILLIO ACCOUNT NUMBER>',
        outgoing_caller_data: {
          to: '<MANDATORY. THE RECEIVING PHONE NUMBER>'
        }
      }
    }
```
## 3. Development
> This section is for individuals developing the Twilio Connector and not intended for end-users.

Here is the workflow:

#### Add configuration 

Configure the connector in conf/local.js

#### Do code changes 

Test suites could be started with:

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

#### Start the connector in standalone mode 
Use  the following commands.

```sh
npm install

npm start
```