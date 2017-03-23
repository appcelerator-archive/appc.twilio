![](https://github.com/appcelerator/appc.twilio/docs/twilio_logo.png)

# Arrow Connector for Twilio

An Arrow connector for [Twilio](https://www.twilio.com).
Twilio service provides building blocks to add messaging, voice, and video in your web and mobile applications.

# Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Service Coverage](#service-coverage)
- [Changelog](#changelog)
- [Development](#development)
- [License](#license)

Node.js SDK v.2.11.1.

# Installation
```sh 
appc install connector/appc.twilio
```

# Configuration
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

# Usage 

# Service Coverage

# Changelog

# Development
> This section is for individuals developing the Twilio Connector and not intended for end-users.

Here is the workflow:

#### Add configuration 

Configure the connector in conf/local.js

#### Do code changes 

Test suites could be started with:
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
Use  the following commands:

```sh
npm install

npm start
```

# Legal Stuff

This software is licensed under the Apache 2 Public License. However, usage of the software to access the Appcelerator Platform is governed by the Appcelerator Enterprise Software License Agreement. Copyright (c) 2014-2017 by Appcelerator, Inc. All Rights Reserved.