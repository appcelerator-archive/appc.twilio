# Arrow ORM [![Build Status](https://travis-ci.org/appcelerator/arrow-orm.svg?branch=master)](https://travis-ci.org/appcelerator/arrow-orm)

Object relational mapping (ORM) framework for [Arrow](https://github.com/appcelerator/arrow).

> This software is pre-release and not yet ready for usage.  Please don't use this just yet while we're working through testing and finishing it up. Once it's ready, we'll make an announcement about it.

## Main Components

There are 4 main components to the ORM framework:

- *Model* - the model that represents data
- *Instance* - an instance of a Model object
- *Collection* - a collection of zero or more Instances
- *Connector* - a connector which is responsible for managing Models

### Model

To define a model, you must give a set of fields and a connector.

```javascript
var User = orm.Model.define('user',{
	fields: {
		name: {
			type: String,
			default: 'Jeff',
		}
	},
	connector: Connector
});
```

The first argument is the name of the model. The second argument is the definition of the model.

The following are Model field properties:

| Name        | Description                                                        |
|-------------|--------------------------------------------------------------------|
| type        | the column type (such as String, Number, etc)                      |
| required    | if true, the field is required                                     |
| minlength   | for Strings and Arrays, the minimum length of the field            |
| maxlength   | for Strings and Arrays, the maximum length of the field            |
| length      | for Strings and Arrays, the precise length of the field            |


The model has several instance methods:

| Name          | Description                                                      |
|---------------|------------------------------------------------------------------|
| extend        | create a new Model class from the current Model                  |
| create        | create a new Model instance                                      |
| update        | update a Model instance                                          |
| remove        | remove a Model instance                                          |
| removeAll     | remove all Model instances                                       |
| findAll       | find all Models                                                  |
| query         | find a Model from a query                                        |
| find          | find one or more Models                                          |
| findByID      | find one Model by a primary key                                  |
| findManyByID  | find many Models by a primary key                                |
| findAndModify | find a Model from a query and modify values                      |
| distinct      | find unique values for a Model field name                        |
| count         | find count of a query                                            |

A model can have custom functions by defining them in the definition as a property.  They will automatically be available on the model instance.

```javascript
var User = orm.Model.define('user',{
	fields: {
		name: {
			type: String,
			required: true,
			default: 'jeff'
		}
	},
	connector: Connector,

	// implement a function that will be on the Model and
	// available to all instances
	getProperName: function() {
		// this points to the instance when this is invoked
		return this.name.charAt(0).toUpperCase() + this.name.substring(1);
	}
});

User.create(function(err,user){
	console.log(user.getProperName());
});
```

### Instance

One you've defined a model, you can then use it to create an Instance of the Model.

```javascript
User.create({name:'Nolan'}, function(err,user){
	// you now have a user instance
});
```

Instances has several methods for dealing with the model.

| Name          | Description                                                      |
|---------------|------------------------------------------------------------------|
| get           | get the value of a field property                                |
| set           | set a value or a set of values (Object)                          |
| isUnsaved     | returns true if the instance has pending changes                 |
| isDeleted     | returns true if the instance has been deleted and cannot be used |
| update        | save any pending changes                                         |
| remove        | remove this instance (delete it)                                 |
| getPrimaryKey | return the primary key value set by the Connector                |

In addition to `get` and `set`, you can also use property accessors to get field values.

```javascript
console.log('name is',user.name);
user.name = 'Rick';
```

### Collection

If the Connector returns more than one Model instance, it will return it as a Collection, which is a container of Model instances.

A collection is an array and has additional helper functions for manipulating the collection.

You can get the length of the collection with the `length` property.

### Connector

To create a connector, you can either inherit from the `Connector` class using `utils.inherit` or extend:

```javascript
var MyConnector = orm.Connector.extend({
	constructor: function(){
	},
	findByID: function(Model, id, callback) {
	}
});
```

Once you have created a Connector class, you can create a new instance:

```javascript
var connector = new MyConnector({
	url: 'http://foobar.com'
});
```

## Licensing

This software is licensed under the Apache 2 Public License.  However, usage of the software to access the Appcelerator Platform is governed by the Appcelerator Enterprise Software License Agreement.  Copyright (c) 2014-2015 by Appcelerator, Inc. All Rights Reserved.
