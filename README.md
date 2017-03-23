# Arrow Connector for Twilio

An Arrow connector for [Twilio](https://www.twilio.com).
Twilio service provides building blocks to add messaging, voice, and video in your web and mobile applications.

# Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Service Compatibility](#service-coverage)
- [Changelog](#changelog)
- [Development](#development)
- [License](#license)

# Installation
The connector works in the context of Arrow application.
So first [create your Arrow application](http://docs.appcelerator.com/platform/latest/#!/guide/API_Builder_Getting_Started). In the terminal from the root of your app install the connector with:

```sh 
appc install connector/appc.twilio
```

# Configuration
After the connector installation configuration file will appear in the conf folder of the app - ``conf/appc.twilio.default.js``.
It will contain template with all configuration parameters.
Some of them have default values but other must be configured appropriately.

You need to set the following configuration properties:
```sh
    connectors: {
      'appc.twilio': {
        skipModelNamespace: '<MANDATORY WITH DEFAULT VALUE = FALSE. MODEL WILL BE NAMESPACED WITH THE CONNECTOR NAME>',
        modelNamespace: '<OPTIONAL. OVERRIDES THE DEFAULT NAMESPACE VALUE WHICH IS SET TO THE NAME OF THE CONNECTOR.>',
        sid: '<MANDATORY. YOUR TWILLIO ACCOUNT SID>',
        auth_token: '<MANDATORY. YOUR TWILLIO ACCOUNT TOKEN>',
        twilio_number: '<MANDATORY. YOUR TWILLIO ACCOUNT NUMBER>'
      }
    }
```

# Usage
Run your arrow application with:
```sh 
appc run
```

Then open the admin ui pannel usually at http://localhost:8080/arrow to play with the available models and exposed endpoints.

# Service Compatibility
The connector consume [Twilio REST API](https://www.twilio.com/docs/api/rest) and use [the following Twilio SDK](https://github.com/twilio/twilio-node).

[Please read this for more information on connector versions, sdk versions and supported resources](./COMPATIBILITY.md)

# Changelog

Please see [the changelog](./CHANGELOG.md)

# Development
> This section is for individuals developing the Twilio Connector and not intended for end-users.

## Sample Development Workflow

Clone this repository

From the root of your project run `npm install`

Run `npm test` to see unite test suite test results

Start doing your code changes

Make sure the test suite is still working after code changes

## Working with actual Twilio API
There are two scenarios when you need to configure the actual service:

* When running integration test suite 
* When starting the connector in standalone mode

The configuration should be made in conf/local.js file. The avaliable options are descibed in Configuration section of this document.

### Integration Test Suite

One additional parameter is needed for the integration test suite, namely the receiving phone number:

```sh
    connectors: {
      'appc.twilio': {
        outgoing_caller_data: {
          to: '<MANDATORY. THE RECEIVING PHONE NUMBER>'
        }
      }
    }
```

After the configuration has been made the integration test suite could be started with:

> `npm run test:integration`

### Start the connector in standalone mode 
Run the following command to do this:
```sh
npm start
```

Usually you could open http://localhost:8080/arrow to play with the available models and endpoints.

## Contributing 

This project is open source and licensed under the [Apache Public License (version 2)](http://www.apache.org/licenses/LICENSE-2.0).  Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

To protect the interests of the contributors, Appcelerator, customers and end users we require contributors to sign a Contributors License Agreement (CLA) before we pull the changes into the main repository. Our CLA is simple and straightforward - it requires that the contributions you make to any Appcelerator open source project are properly licensed and that you have the legal authority to make those changes. This helps us significantly reduce future legal risk for everyone involved. It is easy, helps everyone, takes only a few minutes, and only needs to be completed once.

[You can digitally sign the CLA](http://bit.ly/app_cla) online. Please indicate your email address in your first pull request so that we can make sure that will locate your CLA.  Once you've submitted it, you no longer need to send one for subsequent submissions.

# Legal Stuff

This software is licensed under the Apache 2 Public License. However, usage of the software to access the Appcelerator Platform is governed by the Appcelerator Enterprise Software License Agreement. Copyright (c) 2014-2017 by Appcelerator, Inc. All Rights Reserved.

Appcelerator is a registered trademark of Appcelerator, Inc. Arrow and associated marks are trademarks of Appcelerator. All other marks are intellectual property of their respective owners. Please see the LEGAL information about using our trademarks, privacy policy, terms of usage and other legal information at [http://www.appcelerator.com/legal](http://www.appcelerator.com/legal).