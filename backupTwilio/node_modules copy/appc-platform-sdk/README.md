# Appcelerator Platform SDK

> This is a Node module that will allow you to make API requests to the Appcelerator Platform.

[![Build Status](https://travis-ci.org/appcelerator/appc-platform-sdk.svg)](https://travis-ci.org/appcelerator/appc-platform-sdk) [![npm version](https://badge.fury.io/js/appc-platform-sdk.svg)](http://badge.fury.io/js/appc-platform-sdk) [![Coverage Status](https://coverage.appcelerator.com/appcelerator/appc-platform-sdk/label_master.svg)](https://coverage.appcelerator.com/appcelerator#appc-platform-sdk)
 
## Installation

	$ npm install appc-platform-sdk

## Usage

```javascript
var AppC = require('appc-platform-sdk');

// login
AppC.login(username,password,function(err,session){
	// we got an error, oops
	if (err) return console.error(err);

	// print out some information about our logged in user
	console.log(session.user.username);

	// when you're done, logout
	AppC.logout(session);
});
```

## Auth

Authentication API used for gaining access to the platform.

### Login

Login to the Platform.  Will validate the user and create a user session which will allow you to make subsequent API calls to the platform while the session is valid.

```javascript
AppC.login(username,password,function(err,session){
	// logged in, check err
});
```

### Logout

Logout of the Platform session.  Will invalidate the session object.

```javascript
AppC.logout(session,function(){
	// logged out
});
```

## Session

A new Session instance is created on a succesful login.  The following properties / functions are available:

| Property     | Type     | Description                             |
|--------------|----------|-----------------------------------------|
| isValid      | function | returns true if session is valid        |
| invalidate   | function | invalid (and logout) session            |
| user         | property | user instance                           |
| orgs         | property | user member orgs                        |

You cannot create a session and a session is immutable. Once you invalidate a session, it is no longer valid and must not be used again.

## User

User API for interacting with users of the platform.

### find

Find a specific user details.

```javascript
AppC.User.find(session, '1234', function(err, user){

});
```

### switchLoggedInOrg

Switch the active session user's logged in / active organization.

```javascript
AppC.User.switchLoggedInOrg(session, '4567', function(err){

});
```

## Org

Organization API for interacting with organizations that a user is a member.

### find

Find all the organizations that the current user has visibility.

```javascript
AppC.Org.find(session, function(err,orgs){

});
```

### getCurrent

Return the current organization object for user session.

```javascript
AppC.Org.getCurrent(session);
```

### getById

Return a specific organization by the org_id.

```javascript
AppC.Org.getById(session, org_id);
```

### getByName

Return a specific organization by the name.

```javascript
AppC.Org.getByName(session, 'Org Name');
```

## App

App API for interacting with applications registered with the platform.

### findAll

Find all the apps that the current user has access to

```javascript
// find all apps for current active organization
AppC.App.findAll(session, function(err,apps){

});

// find all apps for the org_id
AppC.App.findAll(session, 'org_id', function(err,apps){

});
```

### find

Find a specific app by app_guid

```javascript
// find a specific app
AppC.App.find(session, 'app_guid', function(err,app){

});
```

### update

Update an app details.

```javascript
// update an app
app.app_name = 'my new app name';
AppC.App.update(session, app, function(err,result){
	console.log(err,result);
})
```

> this API is dangerous. please be cautious in using this API as changes are irreversible.

## Notification

Notification API for handling platform notification events.

### findAll

Find all notifications for the logged in user:

```javascript
// get all notifications
AppC.Notification.findAll(session, function(err,results){

});
```

## Feed

Feed API for handling platform feed events.

### findAll

Find all feed events for the logged in user:

```javascript
// get all feeds
AppC.Feed.findAll(session, function(err,results){

});

// get all feeds for app_guid
AppC.Feed.findAll(session, {app_guid:'123'}, function(err,results){

});

// get feeds by limit
AppC.Feed.findAll(session, {limit:10}, function(err,results){

});
```

The following are options that can be passed to the second parameter of findAll:

- org_id: The ID of the org that the messages were sent to
- app_guid: The guid of the app that the messages were sent to
- limit: A number of records to limit the result to
- since: A unix timestamp to get new messages from
- before: A unix timestamp to get old messages from before

## Cloud

API for accessing Appcelerator Cloud Services (ACS).

### createApp

Create a new pre-built ACS application (mBaaS).

```javascript
// create a new app
AppC.Cloud.createApp(session, "foo", function(err,app){

});
```

Required parameters:

- session: logged in session object
- name: specify the name of the application to create
- callback: function to invoke when completed

Returns a JSON object with the application details such as:

```javascript
{ id: '987w498908098asdfasdfasdf',
  name: 'foo',
  status: 0,
  created_at: '2014-09-29T19:11:40+0000',
  updated_at: '2014-09-29T19:11:40+0000',
  key: 'sdfasdfasdf0989890889asdf89asdf',
  oauth_key: 'asdfasdf08s09d8f09as8df098asdf098',
  oauth_secret: 'sfhjasdhfausdhf8878as87fdasd78f',
  group_id: '9890s8df908as09d8f08asdf88188',
  type: 1 }
```


# Licensing

This code is Confidential and Proprietary to Appcelerator, Inc. All Rights Reserved. This code MUST not be modified, copied or otherwise redistributed without express written permission of Appcelerator. This file is licensed as part of the Appcelerator Platform and governed under the terms of the Appcelerator license agreement.  Your right to use this software terminates when you terminate your Appcelerator subscription.

Distribution through the NPM package system located at http://npmjs.org is expressly granted if the package you are downloading is from the official Appcelerator account at http://npmjs.org/package/appc-platform-sdk.
