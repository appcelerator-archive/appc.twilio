'use strict';

/**
 * @class Arrow.Model
 */
var util = require('util'),
	events = require('events'),
	_ = require('lodash'),
	async = require('async'),
	LRUCache = require('lru-cache'),
	pluralize = require('pluralize'),
	Instance = require('./instance'),
	error = require('./error'),
	ORMError = error.ORMError,
	ValidationError = error.ValidationError,
	Collection = require('./collection'),
	utillib = require('./util'),
	models = [],
	ModelClass = new events.EventEmitter();

util.inherits(Model, events.EventEmitter);
module.exports = Model;

function Model(name, definition, skipValidation) {
	this.name = name;

	var ModelFields = ['name', 'fields', 'connector', '_extended', 'metadata', 'mappings', 'actions', 'disabledActions', 'singular', 'plural', 'autogen', 'generated', 'cache'];

	this.autogen = definition ? definition.autogen === undefined ? true : definition.autogen : true;
	_.defaults(this, _.pick(definition, ModelFields), {
		singular: pluralize(name.toLowerCase(), 1),
		plural: pluralize(name.toLowerCase()),
		metadata: {},
		mappings: {},
		actions: VALID_ACTIONS,
		disabledActions: [],
		generated: false
	});

	validateActions(this.actions);

	if (name !== encodeURI(name)) {
		throw new ValidationError('name', 'Model names cannot contain characters that need to be encoded in a URL: "' + this.name + '"');
	}
	var modelSplit = name.split('/').pop();
	if (modelSplit.indexOf('.') >= 0) {
		throw new ValidationError('name', 'Model names cannot contain periods: "' + this.name + '"');
	}
	if (!skipValidation && !definition) {
		throw new ORMError("missing required definition");
	}
	if (!skipValidation && this.fields && this.fields.id) {
		throw new ValidationError('id', 'id is a reserved field name for the generated primary key');
	}

	if (this.cache === true || (_.isPlainObject(this.cache) && (this.cache.max || this.cache.maxAge))) {
		this.cache = new LRUCache(this.cache === true ? {
			max: 500,
			maxAge: 10 * 60 * 1000 /* 10 minutes */
		} : this.cache);
	}

	validateFields(this.fields);

	// pull out any method definitions
	this.methods = definition && _.omit(definition, ModelFields);
	this._wireMethods();

	models.push(this);
	ModelClass.emit('register', this);
}

/**
 * suitable for util.inspect
 */
Model.prototype.inspect = function () {
	return '[object Model:' + this.name + ']';
};

/**
 * suitable for JSON.stringify
 */
Model.prototype.toJSON = function () {
	return {
		name: this.name,
		fields: this.fields,
		connector: this.connector
	};
};

var VALID_ACTIONS = [
	'read', 'write', 'create', 'upsert', 'findAll', 'findByID', 'findById', 'findOne', 'findAndModify', 'count',
	'query', 'distinct', 'update', 'delete', 'deleteAll'
];

function validateActions(actions) {
	if (actions === undefined || actions === null) {
		return null;
	}
	if (!Array.isArray(actions)) {
		throw new ORMError("actions must be an array with one or more of the following: " + VALID_ACTIONS.join(', '));
	}
	return actions;
}

function validateFields(fields) {
	if (!fields) {
		return;
	}
	Object.keys(fields).forEach(function (name) {
		// should all be the same
		// type: Array
		// type: 'Array'
		// type: 'array'
		var field = fields[name];
		field.type = field.type || 'string';
		var fname = _.isObject(field.type) ? field.type.name : field.type;
		field.type = fname.toLowerCase();
		setOptionality(field);
	});
}

function setOptionality(field) {
	// since we allow both, make sure both are set
	if (field.required !== undefined) {
		field.optional = !field.required;
	}
	else {
		// defaults to optional
		field.required = false;
	}
	if (field.optional !== undefined) {
		field.required = !field.optional;
	}
	else {
		field.optional = true;
	}
}

var excludeMethods = ['getConnector', 'getMeta', 'setMeta', 'get', 'set', 'keys', 'instance', 'getModels', 'payloadKeys', 'translateKeysForPayload', 'toJSON', 'inspect'];

var dispatchers = {
	deleteAll: 'deleteAll',
	removeAll: 'deleteAll',
	fetch: 'query',
	find: 'query',
	query: 'query',
	findAll: 'findAll',
	findByID: 'findByID',
	findById: 'findById',
	findOne: 'findOne',
	delete: 'delete',
	remove: 'delete',
	update: 'save',
	save: 'save',
	create: 'create',
	distinct: 'distinct',
	count: 'count',
	findAndModify: 'findAndModify',
	upsert: 'upsert'
};

Model.prototype._wireMethods = function _wireMethods() {

	if (this._promise) {
		// Bind functions.
		for (var name in this) {
			var fn = this[name];
			if (typeof fn === 'function') {
				if (this.connector) {
					var mapFn = dispatchers[name];
					if (mapFn) {
						var cnFn = this[mapFn];
						// we don't have a connector fn, skip it
						if (typeof cnFn !== 'function') {
							continue;
						}
					}
				}
				if (excludeMethods.indexOf(name) < 0) {
					utillib.createTransactionLoggedDelegate(this, 'model', this, name);
				}
			}
			else {
				// Don't need to do anything.
			}
		}
	}

	// Bind method functions.
	this.methods && Object.keys(this.methods).forEach(function (name) {
		var fn = this.methods[name];
		this[name] = fn;
		// bind the delegate
		if (this._promise && typeof fn === 'function') {
			utillib.createTransactionLoggedDelegate(this, 'model', this, name);
		}
	}.bind(this));

};

/**
 * Returns a list of available Models.
 * @static
 * @returns {Array<Arrow.Model>}
 */
Model.getModels = function getModels() {
	return models;
};

/**
 * Returns a specific Model by name.
 * @static
 * @param {String} name Name of the Model.
 * @returns {Arrow.Model}
 */
Model.getModel = function getModel(name) {
	for (var c = 0; c < models.length; c++) {
		if (models[c].name === name) {
			return models[c];
		}
	}
};

/**
 * Binds a callback to an event.
 * @static
 * @param {String} name Event name
 * @param {Function} cb Callback function to execute.
 */
Model.on = function on() {
	ModelClass.on.apply(ModelClass, arguments);
};

/**
 * Unbinds a callback from an event.
 * @static
 * @param {String} name Event name
 * @param {Function} cb Callback function to remove.
 */
Model.removeListener = function removeListener() {
	ModelClass.removeListener.apply(ModelClass, arguments);
};

/**
 * Unbinds all event callbacks for the specified event.
 * @static
 * @param {String} [name] Event name.  If omitted, unbinds all event listeners.
 */
Model.removeAllListeners = function removeAllListeners() {
	ModelClass.removeAllListeners.apply(ModelClass, arguments);
};

// NOTE: this is internal and only used by the test and should never be called directly
Model.clearModels = function clearModels() {
	models.length = 0;
};

/**
 * Checks for a valid connector and returns it, throwing an ORMError
 * if a connector is not set.
 * @param {Boolean} dontRaiseException Set to true to not throw an error if the model is missing a connector.
 * @return {Arrow.Connector} Connector used by the Model.
 * @throws {Arrow.ORMError}
 */
Model.prototype.getConnector = function getConnector(dontRaiseException) {
	if (!this.connector && !dontRaiseException) {
		throw new ORMError("missing required connector");
	}
	return this.connector;
};

/**
 * Sets the connector for the model.
 * @param connect {Arrow.Connector}
 */
Model.prototype.setConnector = function setConnector(connector) {
	this.connector = connector;
};

Model.prototype.endRequest = function () {
	if (this.connector) {
		this.connector.endRequest();
		this.connector.model = null;
	}
	this.request = null;
	this.response = null;
	this.removeAllListeners();
};

Model.prototype.createRequest = function createRequest(request, response) {
	var connector = this.getConnector().createRequest(request, response);
	var model = Object.create(this);
	model.request = request;
	model.response = response;
	model.connector = connector;
	model.connector.model = model;
	model._promise = true;
	model._wireMethods();
	return model;
};

/**
 * @method define
 * @static
 * Extends a new Model object.
 * @param {String} name Name of the new Model.
 * @param {ArrowModelDefinition} definition Model definition object.
 * @return {Arrow.Model}
 * @throws {Arrow.ValidationError} Using a reserved key name in the definition object.
 * @throws {Arrow.ORMError} Missing definition object.
 */
/**
 * @method extend
 * @alias #static-define
 */
Model.extend =
	Model.define = function define(name, definition) {
		return new Model(name, definition);
	};

function extendOrReduce(instance, name, definition, extend) {
	var model;
	if (typeof name === 'string') {
		model = new Model(name, definition, true);
	}
	else if (name instanceof Model) {
		model = name;
	}
	else {
		throw new ORMError("invalid argument passed to extend. Must either be a model class or model definition");
	}
	model.metadata = _.merge(_.cloneDeep(instance.metadata), model.metadata);
	model.mappings = _.merge(_.cloneDeep(instance.mappings), model.mappings);
	if (model.fields) {
		var fields = instance.fields;
		if (extend) {
			for (var key in model.fields) {
				if (model.fields.hasOwnProperty(key)) {
					model.fields[key]._own = true;
				}
			}
			model.fields = mergeFields(model.fields, fields);
		}
		else {
			// allow the extending model to just specify the fields keys and pull out
			// the actual values from the extended model field (or merge them)
			Object.keys(model.fields).forEach(function (name) {
				if (name in fields) {
					model.fields[name] = _.merge(_.cloneDeep(fields[name]), model.fields[name]);
				}
			});
		}
	}
	else {
		model.fields = _.cloneDeep(instance.fields);
	}
	model.connector = model.connector || instance.connector;
	model.methods = _.merge(_.cloneDeep(instance.methods), model.methods);
	model.autogen = instance.autogen;
	model.actions = (definition && definition.actions) ? definition.actions : instance.actions;
	model.disabledActions = (definition && definition.disabledActions) ? definition.disabledActions : instance.disabledActions;
	model._extended = !!extend;
	model._supermodel = instance.name;
	model._parent = instance;
	model._wireMethods();
	return model;
}

/**
 * Creates a new Model which extends the current Model object. The fields specified in the
 * definition object will be merged with the ones defined in the current Model object.
 * @param {String} name Name of the new Model.
 * @param {ArrowModelDefinition} definition Model definition object.
 * @return {Arrow.Model}
 * @throws {Arrow.ValidationError} Using a reserved key name in the definition object.
 * @throws {Arrow.ORMError} Model is not valid or missing the definition object.
 */
Model.prototype.extend = function extend(name, definition) {
	return extendOrReduce(this, name, definition, true);
};

/**
 * Creates a new Model which reduces fields from the current Model class.
 * Only the fields specified in the definition object that are found in the current Model object
 * will be used.
 * @param {String} name Name of the new Model.
 * @param {ArrowModelDefinition} definition Model definition object.
 * @return {Arrow.Model}
 * @throws {Arrow.ValidationError} Using a reserved key name in the definition object.
 * @throws {Arrow.ORMError} Model is not valid or missing the definition object.
 */
Model.prototype.reduce = function extend(name, definition) {
	return extendOrReduce(this, name, definition, false);
};

/**
 * Creates an instance of this Model.
 * @param {Object} values Attributes to set.
 * @param {Boolean} skipNotFound Set to `true` to skip fields passed in
 * to the `value` parameter that are not defined by the Model's schema.  By default,
 * an error will be thrown if an undefined field is passed in.
 * @return {Arrow.Instance}
 * @throws {Arrow.ORMError} Model class is missing fields.
 * @throws {Arrow.ValidationError} Missing required field or field failed validation.
 */
Model.prototype.instance = function instance(values, skipNotFound) {
	if (typeof values === 'string') {
		throw new ORMError('The first argument to model.instance() cannot be a string: ' + values);
	}
	return new Instance(this, values, skipNotFound);
};

function resolveOptionality(field, param) {
	setOptionality(field);
	if (field.default !== undefined) {
		param.default = field.default;
	}
	param.required = field.required;
	param.optional = field.optional;
	return param;
}

/**
 * Documents the create method for API usage.
 * @return {Object}
 */
Model.prototype.createAPI = function createAPI() {
	var model = this;
	var parameters = {};
	Object.keys(model.fields).forEach(function (k) {
		var field = model.fields[k];
		parameters[k] = resolveOptionality(field, {
			description: field.description || k + ' field',
			dataType: field.type,
			type: 'body'
		});
	});
	return {
		generated: true,
		uiSort: 2,
		actionGroup: 'write',
		method: 'POST',
		nickname: 'Create',
		description: this.createDescription || 'Create a ' + this.singular,
		beforeEvent: this.beforeCreateEvent || this.beforeEvent,
		afterEvent: this.afterCreateEvent || this.afterEvent,
		eventTransformer: this.createEventTransformer || this.eventTransformer,
		parameters: parameters,
		responses: {
			201: {
				description: 'The create succeeded.',
				headers: {
					Location: {
						description: 'The URL to the newly created instance.',
						type: 'string'
					}
				}
			}
		},
		action: function createAction(req, resp, next) {
			try {
				req.model.create(req.params, next);
			}
			catch (E) {
				return next(E);
			}
		}
	};
};

/**
 * Creates a new Model or Collection object.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
Model.prototype.create = function create(values, callback) {
	if (_.isFunction(values)) {
		callback = values;
		values = {};
	}
	// if we have an array of values, create all the users in one shot
	// in the case of a DB, you want to send them in batch
	if (Array.isArray(values)) {
		return this.getConnector().createMany(this, values.map(function (v) {
			return this.instance(v, false).toPayload();
		}.bind(this)), callback);
	}
	try {
		// we need to create an instance to run the validator logic if any
		var instance = this.instance(values, false);
		var payload = instance.toPayload();
		var pk = this.getConnector().getPrimaryKey(this, instance) || 'id';
		if (values[pk]) {
			payload[pk] = values[pk];
		}
		var next = callback,
			cache = this.cache;
		if (cache) {
			next = function (err, result) {
				if (result && result.getPrimaryKey) {
					cache.del('count');
					cache.del('findAll');
					cache.set(result.getPrimaryKey(), result);
				}
				return callback && callback.apply(this, arguments);
			};
		}
		this.getConnector().create(this, payload, next);
	}
	catch (E) {
		if (E instanceof ORMError) {
			if (callback) {
				return callback(E);
			}
		}
		throw E;
	}
};

/**
 * Documents the update method for API usage.
 * @returns {Object}
 */
Model.prototype.updateAPI = function updateAPI() {
	var model = this;
	var parameters = {
		id: {
			description: 'The ' + this.singular + ' ID',
			required: true,
			optional: false,
			type: 'path',
			dataType: 'string'
		}
	};
	Object.keys(model.fields).forEach(function (k) {
		var field = model.fields[k];
		parameters[k] = resolveOptionality(field, {
			description: field.description || k + ' field',
			dataType: field.type,
			type: 'body'
		});
		parameters[k].required = false;
		parameters[k].optional = true;
	});
	return {
		generated: true,
		uiSort: 5,
		path: './:id',
		actionGroup: 'write',
		method: 'PUT',
		nickname: 'Update',
		description: this.updateDescription || 'Update a specific ' + this.singular,
		beforeEvent: this.beforeUpdateEvent || this.beforeEvent,
		afterEvent: this.afterUpdateEvent || this.afterEvent,
		eventTransformer: this.updateEventTransformer || this.eventTransformer,
		parameters: parameters,
		dependsOnAll: ['save'],
		responses: {
			204: {
				description: 'The update succeeded.'
			}
		},
		action: function updateAction(req, resp, next) {
			req.model.fetch(req.params.id, resp.createCallback(null, function putSuccessCallback(model, cb) {
				try {
					model.set(req.params);
					model.save(cb);
				}
				catch (E) {
					return next(E);
				}
			}, next));
		}
	};
};

/**
 * @method save
 * Updates a Model instance.
 * @param {Arrow.Instance} instance Model instance to update.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated model.
 */
/**
 * @method update
 * @alias #save
 */
Model.prototype.update =
	Model.prototype.save = function save(instance, callback) {
		if (instance.isDeleted && instance.isDeleted()) {
			callback && callback(new ORMError('instance has already been deleted'));
			return;
		}
		if (!(instance instanceof Instance) || instance.isUnsaved()) {
			if (!(instance instanceof Instance)) {
				// do we have an id? then we can look up the instance directly!
				if (instance.id) {
					return this.findByID(instance.id, function findByIDCallback(err, _instance) {
						if (err) { return callback(err); }
						if (!_instance) { return callback("trying to update, couldn't find record with primary key: " + instance.id + " for " + this.name); }
						_instance.set(instance);
						this.update(_instance, callback);
					}.bind(this));
				}
				// otherwise, we can try instantiating the instance directly right here.
				this.instance(instance, false);
			}
			var cache = this.cache;
			this.getConnector().save(this, instance, function saveCallback(err, result) {
				if (err) { return callback && callback(err); }
				if (result) {
					result._dirty = false;
					result.emit('save');
					if (cache) {
						cache.del('findAll');
						cache.set(result.getPrimaryKey(), result);
					}
				}
				else if (cache) {
					cache.reset();
				}

				callback && callback(null, result);
			});
		}
		// no changes, just return it
		else {
			return callback && callback(null, instance);
		}
	};

/**
 * Documents the delete method for API usage.
 * @returns {Object}
 */
Model.prototype.deleteAPI = function deleteAPI() {
	return {
		generated: true,
		uiSort: 10,
		path: './:id',
		actionGroup: 'write',
		method: 'DELETE',
		nickname: 'Delete One',
		beforeEvent: this.beforeDeleteEvent || this.beforeEvent,
		afterEvent: this.afterDeleteEvent || this.afterEvent,
		eventTransformer: this.deleteEventTransformer || this.eventTransformer,
		description: this.deleteDescription || 'Delete a specific ' + this.singular,
		parameters: {
			id: {
				description: 'The ' + this.singular + ' ID',
				optional: false,
				required: true,
				type: 'path',
				dataType: 'string'
			}
		},
		responses: {
			204: {
				description: 'The delete succeeded.'
			}
		},
		action: function deleteAction(req, resp, next) {
			try {
				req.model.remove(req.params.id, next);
			}
			catch (E) {
				return next(E);
			}
		}
	};
};

/**
 * @method remove
 * Deletes the model instance.
 * @param {Arrow.Instance} instance Model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted model.
 */
/**
 * @method delete
 * @alias #remove
 */
Model.prototype.delete =
	Model.prototype.remove = function remove(instance, callback) {
		if (typeof instance === 'object' && instance._deleted) {
			return callback && callback(new ORMError('instance has already been deleted'));
		}
		// quick validation
		if (_.isFunction(instance)) {
			callback = instance;
			instance = undefined;
		}
		// array of ids means multiple delete
		if (_.isArray(instance)) {
			return this.getConnector().deleteMany(this, instance, callback);
		}
		// if we specified a non-Instance, we need to findByID to get the instance
		// and then delete it
		if (typeof instance !== 'object') {
			return this.findByID(instance, function findByIDCallback(err, _instance) {
				if (err) { return callback(err); }
				if (!_instance) { return callback("trying to remove, couldn't find record with primary key: " + instance + " for " + this.name); }
				this.remove(_instance, callback);
			}.bind(this));
		}
		var cache = this.cache;
		this.getConnector().delete(this, instance, function deleteCallback(err, result) {
			if (err) { return callback && callback(err); }
			if (result) {
				result._deleted = true;
				result.emit('delete');
				if (cache) {
					cache.del('count');
					cache.del('findAll');
					cache.set(result.getPrimaryKey(), result);
				}
			}
			else if (cache) {
				cache.reset();
			}
			callback && callback(null, result);
		});
	};

/**
 * Documents the delete all method for API usage.
 * @returns {Object}
 */
Model.prototype.deleteAllAPI = function deleteAllAPI() {
	return {
		generated: true,
		uiSort: 11,
		method: 'DELETE',
		actionGroup: 'write',
		nickname: 'Delete All',
		description: this.deleteAllDescription || 'Deletes all ' + this.plural,
		beforeEvent: this.beforeDeleteAllEvent || this.beforeEvent,
		afterEvent: this.afterDeleteAllEvent || this.afterEvent,
		eventTransformer: this.deleteAllEventTransformer || this.eventTransformer,
		responses: {
			204: {
				description: 'The delete succeeded.'
			}
		},
		action: function deleteAction(req, resp, next) {
			req.model.deleteAll(resp.createCallback(null, function delAllSuccessCallback(count, cb) {
				if (count !== undefined) {
					resp.noContent(cb);
				}
				else {
					resp.notFound(cb);
				}
			}, next));
		}
	};
};

/**
 * @method removeAll
 * Deletes all the data records.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted models.
 */
/**
 * @method deleteAll
 * @alias #removeAll
 */
Model.prototype.deleteAll =
	Model.prototype.removeAll = function removeAll(callback) {
		var next = callback,
			cache = this.cache;
		if (cache) {
			next = function () {
				cache.reset();
				return callback && callback.apply(this, arguments);
			};
		}
		this.getConnector().deleteAll(this, next);
	};

/**
 * Documents the distinct method for API usage.
 * @returns {Object}
 */
Model.prototype.distinctAPI = function distinctAPI() {
	var result = this.queryAPI();
	result.nickname = 'Distinct';
	result.uiSort = 9;
	result.path = './distinct/:field';
	result.description = this.distinctDescription || 'Find distinct ' + this.plural;
	result.dependsOnAny = ['query'];
	result.beforeEvent = this.beforeDistinctEvent || this.beforeEvent;
	result.afterEvent = this.afterDistinctEvent || this.afterEvent;
	result.eventTransformer = this.distinctEventTransformer || this.eventTransformer;
	result.responses = {
		200: {
			description: 'The request succeeded, and the results are available.',
			schema: {
				type: 'integer'
			}
		}
	};
	result.parameters.field = {
		type: 'path',
		optional: false,
		required: true,
		dataType: 'string',
		description: 'The field name that must be distinct.'
	};
	result.responses[200] = {
		description: 'Distinct fields response.',
		schema: {
			type: 'array',
			items: {
				type: 'string'
			},
			uniqueItems: true
		}
	};
	result.action = function distinctAction(req, resp, next) {
		var field = req.params.field;
		delete req.params.field;
		resp.stream(req.model.distinct, field, req.params, next);
	};
	return result;
};

/**
 * Finds unique values using the provided field.
 * @param {String} field The field that must be distinct.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the distinct models.
 * @throws {Error} Failed to parse query options.
 */
Model.prototype.distinct = function distinct(field, options, callback) {
	try {
		options = prepareQueryOptions(this, options);
	}
	catch (E) {
		return callback(E);
	}
	this.getConnector().distinct(this, field, options, callback);
};

/**
 * Documents the findByID method for API usage.
 * @return {Object}
 */
Model.prototype.findByIDAPI = function findByIDAPI() {
	return {
		generated: true,
		uiSort: 4,
		path: './:id',
		actionGroup: 'read',
		nickname: 'Find By ID',
		method: 'GET',
		description: this.findByIDDescription || this.findByIdDescription || this.findOneDescription || 'Find one ' + this.singular + ' by ID',
		beforeEvent: this.beforeFindByIDEvent || this.beforeFindByIdEvent || this.beforeFindOneEvent || this.beforeEvent,
		afterEvent: this.afterFindByIDEvent || this.afterFindByIdEvent || this.afterFindOneEvent || this.afterEvent,
		eventTransformer: this.findByIDEventTransformer || this.findByIdEventTransformer || this.findOneEventTransformer || this.eventTransformer,
		parameters: {
			id: {
				description: 'The find succeeded, and the results are available.',
				optional: false,
				required: true,
				type: 'path',
				dataType: 'string'
			}
		},
		responses: {
			200: {
				description: this.name + ' Response',
				schema: {
					$ref: '#/definitions/' + this.name.replace(/\//g, '_')
				}
			}
		},
		action: function findByIDAction(req, resp, next) {
			try {
				resp.stream(req.model.findByID, req.params.id, next);
			}
			catch (E) {
				return next(E);
			}
		}
	};
};

/**
 * Warning: This method is being deprecated and should not be used in your implementation.
 * Finds a model instance using the primary key.
 */
Model.prototype.findOne = function () {
	// Get connector's logger or fallbacks to console.warn if it not exists
	var connector = this.getConnector();
	var log = connector.logger ? connector.logger.warn.bind(connector.logger) : console.warn.bind(console);

	log('The findOne method of a model is deprecated and will be removed in an upcoming major release. Please use findById instead.');

	// Fallback to findByID
	return this.findByID.apply(this, arguments);
};

/**
 * Finds a model instance using the primary key.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
Model.prototype.findByID = Model.prototype.findById = function findByID(id, callback) {
	try {
		var next = callback,
			cache = this.cache;
		if (!_.isArray(id) && cache) {
			var cached = cache.get(id);
			if (cached) {
				return callback(null, cached);
			}
			next = function (err, result) {
				if (result && result.getPrimaryKey) {
					cache.set(result.getPrimaryKey(), result);
				}
				callback.apply(this, arguments);
			};
		}
		var connector = this.getConnector();
		if (connector.findByID) {
			connector[_.isArray(id) ? 'findManyByID' : 'findByID'](this, id, next);
		} else if (connector.findById) {
			connector[_.isArray(id) ? 'findManyById' : 'findById'](this, id, next);
		} else {
			connector[_.isArray(id) ? 'findOneMany' : 'findOne'](this, id, next);
		}
	} catch (E) {
		return callback(E);
	}
};

/**
 * Documents the query method for API usage.
 * @returns {Object}
 */
Model.prototype.findAndModifyAPI = function findAndModifyAPI() {
	var model = this;
	var parameters = {
		limit: {
			type: 'query',
			optional: true,
			required: false,
			dataType: 'number',
			default: 10,
			description: 'The number of records to fetch. The value must be greater than 0, and no greater than 1000.'
		},
		skip: {
			type: 'query',
			optional: true,
			required: false,
			dataType: 'number',
			default: 0,
			description: 'The number of records to skip. The value must not be less than 0.'
		},
		where: {
			type: 'query',
			optional: true,
			required: false,
			dataType: 'object',
			description: 'Constrains values for fields. The value should be encoded JSON.'
		},
		order: {
			type: 'query',
			optional: true,
			required: false,
			dataType: 'object',
			description: 'A dictionary of one or more fields specifying sorting of results. In general, you can sort based on any predefined field that you can query using the where operator, as well as on custom fields. The value should be encoded JSON.'
		},
		sel: {
			type: 'query',
			optional: true,
			required: false,
			dataType: 'object',
			description: 'Selects which fields to return from the query. Others are excluded. The value should be encoded JSON.'
		},
		unsel: {
			type: 'query',
			optional: true,
			required: false,
			dataType: 'object',
			description: 'Selects which fields to not return from the query. Others are included. The value should be encoded JSON.'
		},
		page: {
			type: 'query',
			optional: true,
			required: false,
			default: 1,
			dataType: 'number',
			description: 'Request page number starting from 1.'
		},
		per_page: {
			type: 'query',
			optional: true,
			required: false,
			default: 10,
			dataType: 'number',
			description: 'Number of results per page.'
		}
	};
	Object.keys(model.fields).forEach(function (k) {
		var field = model.fields[k];
		parameters[k] = resolveOptionality(field, {
			description: field.description || k + ' field',
			optional: field.optional,
			required: field.required,
			type: 'body',
			dataType: field.type
		});
	});
	return {
		generated: true,
		uiSort: 6,
		path: './findAndModify',
		actionGroup: 'write',
		method: 'PUT',
		nickname: 'Find and Modify',
		dependsOnAll: ['query', 'create', 'save'],
		beforeEvent: this.beforeFindAndModifyEvent || this.beforeEvent,
		afterEvent: this.afterFindAndModifyEvent || this.afterEvent,
		eventTransformer: this.findAndModifyEventTransformer || this.eventTransformer,
		description: this.findAndModifyDescription || 'Find and modify ' + this.plural,
		parameters: parameters,
		responses: {
			204: {
				description: 'The find and modify succeeded.'
			}
		},
		action: function queryAction(req, resp, next) {
			try {
				resp.stream(req.model.findAndModify, req.query, req.body, next);
			}
			catch (E) {
				return next(E);
			}
		}
	};
};
/**
 * Finds one model instance and modifies it.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Object} doc Attributes to modify.
 * @param {Object} [args] Optional parameters.
 * @param {Boolean} [args.new=false] Set to `true` to return the new model instead of the original model.
 * @param {Boolean} [args.upsert=false] Set to `true` to allow the method to create a new model.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the modified model.
 * @throws {Error} Failed to parse query options.
 */
Model.prototype.findAndModify = function findAndModify(options, doc, args, callback) {
	try {
		options = prepareQueryOptions(this, options);
		var next = callback,
			cache = this.cache;
		if (cache) {
			next = function () {
				cache.reset();
				return callback && callback.apply(this, arguments);
			};
		}
		this.getConnector().findAndModify(this, options, doc, args, next);
	}
	catch (E) {
		callback(E);
	}
};

/**
 * Documents the findAll method for API usage.
 * @returns {Object}
 */
Model.prototype.findAllAPI = function findAllAPI() {
	return {
		generated: true,
		uiSort: 1,
		beforeEvent: this.beforeFindAllEvent || this.beforeEvent,
		afterEvent: this.afterFindAllEvent || this.afterEvent,
		eventTransformer: this.findAllEventTransformer || this.eventTransformer,
		nickname: 'Find All',
		description: this.findAllDescription || 'Find all ' + this.plural,
		actionGroup: 'read',
		method: 'GET',
		dependsOnAny: ['findAll', 'query'],
		responses: {
			200: {
				description: 'The find all succeeded, and the results are available.',
				schema: {
					type: 'array',
					items: {
						$ref: '#/definitions/' + this.name.replace(/\//g, '_')
					}
				}
			}
		},
		action: function findAllAction(req, resp, next) {
			try {
				resp.stream(req.model.findAll, next);
			}
			catch (E) {
				return next(E);
			}
		}
	};
};

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
Model.prototype.findAll = function findAll(callback) {
	try {
		var next = callback,
			cache = this.cache;
		if (cache) {
			var cached = cache.get('findAll');
			if (cached) {
				return callback(null, cached);
			}
			next = function (err, results) {
				if (results) {
					cache.set('findAll', results);
					if (_.isArray(results)) {
						for (var i = 0; i < results.length; i++) {
							var result = results[i];
							if (result.getPrimaryKey()) {
								cache.set(result.getPrimaryKey(), result);
							}
						}
					}
				}
				callback.apply(this, arguments);
			};
		}

		if (this.getConnector().findAll) {
			return this.getConnector().findAll(this, next);
		}
		else {
			return this.query({limit: 1000}, next);
		}
	}
	catch (E) {
		callback(E);
	}
};

/**
 * Documents the count method for API usage.
 * @returns {Object}
 */
Model.prototype.countAPI = function countAPI() {
	var result = this.queryAPI();
	result.nickname = 'Count';
	result.uiSort = 7;
	result.path = './count';
	result.description = this.countDescription || 'Count ' + this.plural;
	result.dependsOnAny = ['query'];
	result.beforeEvent = this.beforeCountEvent || this.beforeEvent;
	result.afterEvent = this.afterCountEvent || this.afterEvent;
	result.eventTransformer = this.countEventTransformer || this.eventTransformer;
	result.responses = {
		200: {
			description: 'The count succeeded, and the results are available.',
			schema: {
				type: 'integer'
			}
		}
	};
	result.action = function countAction(req, resp, next) {
		resp.stream(req.model.count, req.params, function (err, results) {
			var count = 0;
			if (Array.isArray(results)) {
				count = results.length;
			}
			else if (typeof(results) === 'number') {
				count = results;
			}
			return next(null, count);
		});
	};
	return result;
};

/**
 * Gets a count of records.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the number of models found.
 */
Model.prototype.count = function count(options, callback) {
	try {
		if (_.isFunction(options) && !callback) {
			callback = options;
			options = {};
		}
		var next = callback,
			cache = this.cache;
		if (cache && (!options || Object.keys(options).length === 0)) {
			var cached = cache.get('count');
			if (cached) {
				return callback(null, cached);
			}
			next = function (err, results) {
				if (results) {
					cache.set('count', results);
				}
				callback.apply(this, arguments);
			};
		}
		this.getConnector().count(this, options, next);
	}
	catch (E) {
		callback(E);
	}
};

/**
 * Documents the upsert method for API usage.
 * @returns {Object}
 */
Model.prototype.upsertAPI = function upsertAPI() {
	var result = this.createAPI();
	result.nickname = 'Upsert';
	result.uiSort = 8;
	result.path = './upsert';
	result.actionGroup = 'write';
	result.description = this.upsertDescription || 'Create or update a ' + this.singular;
	result.parameters.id = {
		description: 'The ' + this.singular + ' ID',
		type: 'body',
		optional: true,
		required: false,
		dataType: 'string'
	};
	result.dependsOnAll = ['save', 'create'];
	result.beforeEvent = this.beforeUpsertEvent || this.beforeEvent;
	result.afterEvent = this.afterUpsertEvent || this.afterEvent;
	result.eventTransformer = this.upsertEventTransformer || this.eventTransformer;
	result.responses = {
		201: {
			description: 'The upsert succeeded, and resulted in an insert.',
			headers: {
				Location: {
					description: 'The URL to the newly created instance.',
					type: 'string'
				}
			}
		},
		204: {
			description: 'The upsert succeeded, and resulted in an update.'
		}
	};
	result.action = function upsertAction(req, resp, next) {
		try {
			req.model.upsert(req.params.id, req.params, next);
		}
		catch (E) {
			return next(E);
		}
	};
	return result;
};

/**
 * Updates a model or creates the model if it cannot be found.
 * @param {String} id ID of the model to update.
 * @param {Object} doc Model attributes to set.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated or new model.
 */
Model.prototype.upsert = function upsert(id, doc, callback) {
	// we need to create an instance to run the validator logic if any
	try {
		var instance = this.instance(doc, false);
		var payload = instance.toPayload();
		var pk = this.getConnector().getPrimaryKey(this, instance) || 'id';
		if (doc[pk]) {
			payload[pk] = doc[pk];
		}
		var next = callback,
			cache = this.cache;
		if (cache) {
			next = function () {
				cache.del('count');
				cache.del('findAll');
				if (id) {
					cache.del(id);
				}
				return callback && callback.apply(this, arguments);
			};
		}
		this.getConnector().upsert(this, id, payload, next);
	}
	catch (E) {
		callback(E);
	}
};

/**
 * Documents the query method for API usage.
 * @returns {Object}
 */
Model.prototype.queryAPI = function queryAPI() {
	return {
		nickname: 'Query',
		generated: true,
		uiSort: 3,
		path: './query',
		method: 'GET',
		description: this.queryDescription || 'Query ' + this.plural,
		actionGroup: 'read',
		parameters: {
			limit: {
				type: 'query',
				optional: true,
				required: false,
				default: 10,
				dataType: 'number',
				description: 'The number of records to fetch. The value must be greater than 0, and no greater than 1000.'
			},
			skip: {
				type: 'query',
				optional: true,
				required: false,
				default: 0,
				dataType: 'number',
				description: 'The number of records to skip. The value must not be less than 0.'
			},
			where: {
				type: 'query',
				optional: true,
				required: false,
				dataType: 'object',
				description: 'Constrains values for fields. The value should be encoded JSON.'
			},
			order: {
				type: 'query',
				optional: true,
				required: false,
				dataType: 'object',
				description: 'A dictionary of one or more fields specifying sorting of results. In general, you can sort based on any predefined field that you can query using the where operator, as well as on custom fields. The value should be encoded JSON.'
			},
			sel: {
				type: 'query',
				optional: true,
				required: false,
				dataType: 'object',
				description: 'Selects which fields to return from the query. Others are excluded. The value should be encoded JSON.'
			},
			unsel: {
				type: 'query',
				optional: true,
				required: false,
				dataType: 'object',
				description: 'Selects which fields to not return from the query. Others are included. The value should be encoded JSON.'
			},
			page: {
				type: 'query',
				optional: true,
				required: false,
				default: 1,
				dataType: 'number',
				description: 'Request page number starting from 1.'
			},
			per_page: {
				type: 'query',
				optional: true,
				required: false,
				default: 10,
				dataType: 'number',
				description: 'Number of results per page.'
			}
		},
		beforeEvent: this.beforeQueryEvent || this.beforeEvent,
		afterEvent: this.afterQueryEvent || this.afterEvent,
		eventTransformer: this.queryEventTransformer || this.eventTransformer,
		responses: {
			200: {
				description: 'The query succeeded, and the results are available.',
				schema: {
					type: 'array',
					items: {
						$ref: '#/definitions/' + this.name.replace(/\//g, '_')
					}
				}
			}
		},
		action: function queryAction(req, resp, next) {
			try {
				resp.stream(req.model.query, req.params, next);
			}
			catch (E) {
				return next(E);
			}
		}
	};
};

/**
 * Queries for particular model records.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
Model.prototype.query = function query(options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	try {
		options = prepareQueryOptions(this, options);
		this.getConnector().query(this, options, ((options && options.limit && options.limit === 1) ? function (err, collection) {
			if (err) { return callback(err); }
			// if we asked for limit 1 record on query, just return an object instead of an array
			if (collection) {
				var instance = collection && collection[0];
				return callback(null, instance);
			}
			return callback(null, collection);
		} : callback));
	}
	catch (E) {
		return callback(E);
	}

};

/**
 * @method find
 * Finds a particular model record or records.
 * @param {Object/String} [options] Key-value pairs or ID of the model to find. If omitted, performs a findAll operation.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model record(s).
 * @throws {Error} Wrong number of arguments.
 */
/**
 * @method fetch
 * @alias #find
 */
Model.prototype.fetch =
	Model.prototype.find = function find() {
		switch (arguments.length) {
			case 1:
			{
				return this.findAll(arguments[0]);
			}
			case 2:
			{
				var options = arguments[0],
					callback = arguments[1];
				if (_.isObject(options)) {
					return this.query(options, callback);
				}
				return this.findByID(options, callback);
			}
			default:
			{
				throw new Error("wrong number of parameters passed");
			}
		}
	};

/**
 * Returns model metadata.
 * @param {String} key Key to retrieve.
 * @param {Any} def Default value to return if the key is not set.
 * Does not set the value of the key.
 * @returns {Any}
 */
Model.prototype.getMeta = function getMeta(key, def) {
	var m1 = this._connector && this.metadata[this._connector];
	if (m1 && m1[key]) {
		return m1[key];
	}
	var m2 = this.getConnector() && this.metadata[this.getConnector().name];
	if (m2 && m2[key]) {
		return m2[key];
	}
	var m3 = this.metadata;
	if (m3 && m3[key]) {
		return m3[key];
	}
	return def || null;
};

/**
 * Sets metadata for the model.
 * @param {String} key Key name.
 * @param {Any} value Value to set.
 */
Model.prototype.setMeta = function setMeta(key, value) {
	var connector = this.getConnector();
	var entry = this.metadata[connector.name];
	if (!entry) {
		entry = this.metadata[connector.name] = {};
	}
	entry[key] = value;
};

/**
 * Returns the field keys for the Model.
 * @returns {Array<String>}
 */
Model.prototype.keys = function keys() {
	return Object.keys(this.fields);
};

/**
 * Returns the payload keys (model field names) for the Model.
 * @return {Array<String>}
 */
Model.prototype.payloadKeys = function keys() {
	var retVal = [];
	for (var key in this.fields) {
		if (this.fields.hasOwnProperty(key) && !this.fields[key].custom) {
			retVal.push(this.fields[key].name || key);
		}
	}
	return retVal;
};

function parseBoolean(obj) {
	if (typeof(obj) === 'boolean') {
		return obj;
	}
	else if (typeof(obj) === 'string') {
		return /^(1|true|yes|ok)$/.test(String(obj).toLowerCase());
	}
	return obj;
}

function parseDate(obj) {
	if (obj instanceof Date) {
		return obj;
	}
	else if (typeof(obj) === 'string') {
		return new Date(Date.parse(obj));
	}
	return obj;
}

function parseNumber(obj) {
	if (obj instanceof Number) {
		return obj;
	}
	else if (typeof(obj) === 'string') {
		return parseInt(obj, 10);
	}
	return obj;
}

/**
 * Returns an object containing keys translated from field keys to payload keys. This is useful for translating objects
 * like "where", "order", "sel" and "unsel" to their proper named underlying payload objects.
 * @param obj
 * @returns {Object}
 */
Model.prototype.translateKeysForPayload = function translateKeysForPayload(obj) {
	if (obj && _.isString(obj)) {
		try {
			obj = JSON.parse(obj);
		}
		catch (E) {
		}
	}
	if (!obj || typeof(obj) !== 'object') {
		return obj;
	}
	var keys = Object.keys(obj);
	if (!keys.length) {
		return obj;
	}
	var translation = {};
	for (var fieldKey in this.fields) {
		if (this.fields.hasOwnProperty(fieldKey)) {
			var field = this.fields[fieldKey],
				srckey = field.name || fieldKey;
			translation[fieldKey] = srckey;
			switch (field.type) {
				case 'number':
				{
					obj[srckey] = parseNumber(obj[srckey]);
					break;
				}
				case 'boolean':
				{
					obj[srckey] = parseBoolean(obj[srckey]);
					break;
				}
				case 'date':
				{
					obj[srckey] = parseDate(obj[srckey]);
					break;
				}
				default:
				{
					break;
				}
			}
		}
	}
	var retVal = {};
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		retVal[translation[key] || key] = obj[key];
	}
	return retVal;
};

/**
 * Checks to see if the specified key in the object is a function
 * and converts it to a Function if it was converted to a string.
 * This is a helper function for the {@link #set} and {@link #get} methods.
 * @static
 * @param {Object} obj Object to check.
 * @param {String} key Key to check.
 * @returns {Function/String} If the key is not a function, returns the string, else returns the function.
 */
Model.toFunction = function (obj, key) {
	// if this is a string, return
	var fn = obj[key];
	if (fn && _.isString(fn) && /^function/.test(fn.trim())) {
		var vm = require('vm');
		var code = 'var f = (' + fn + '); f';
		fn = vm.runInThisContext(code, {
			timeout: 10000
		});
		// re-write it so we only need to remap once
		obj[key] = fn;
	}
	return fn;
};

/**
 * Processes the field value before its returned to the client.
 * This function executes the field's `get` method defined in either the Model's {@link #mappings}
 * property or the model definition object.
 * @param {String} name Field name.
 * @param {Any} value Value of the field.
 * @param {Arrow.Instance} instance Model instance.
 * @returns {Any} Value you want to return to the client.
 */
Model.prototype.get = function get(name, value, instance) {
	var mapper = this.mappings[name] || this.fields[name];
	if (mapper) {
		var fn = Model.toFunction(mapper, 'get');
		if (fn) {
			return fn(value, name, instance);
		}
	}
	return value;
};

/**
 * Processes the field value before its returned to the connector.
 * This function executes the field's `set` method defined in either the Model's {@link #mappings}
 * property or the model definition object.
 * @param {String} name Field name.
 * @param {Any} value Value of the field.
 * @param {Arrow.Instance} instance Model instance.
 * @returns {Any} Value you want to return to the connector.
 */
Model.prototype.set = function set(name, value, instance) {
	var mapper = this.mappings[name] || this.fields[name];
	if (mapper) {
		var fn = Model.toFunction(mapper, 'set');
		if (fn) {
			return fn(value, name, instance);
		}
	}
	return value;
};


/*
 Utility.
 */

function parseProperties(object) {
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			var val = object[key];
			if (val && typeof val === 'string' && val[0] === '{') {
				try {
					val = JSON.parse(val);
					object[key] = val;
				}
				catch (err) {
					if (key === 'where') {
						err.message = 'Failed to parse "where" as JSON: ' + err.message;
						throw err;
					}
				}
			}
		}
	}
}

function translateCSVToObject(str) {
	var retVal = {},
		split = str.split(',');
	for (var i = 0; i < split.length; i++) {
		retVal[split[i].trim()] = 1;
	}
	return retVal;
}

/*
 * Merges the fields, taking in to consideration renamed fields.
 * @param definedFields
 * @param inheritedFields
 * @returns {*}
 */
function mergeFields(definedFields, inheritedFields) {
	var retVal = _.merge({}, inheritedFields, definedFields);
	for (var key in definedFields) {
		if (definedFields.hasOwnProperty(key)) {
			var definedField = definedFields[key];
			if (definedField.name && definedField.name !== key && inheritedFields[definedField.name]) {
				delete retVal[definedField.name];
			}
		}
	}
	return retVal;
}

/*
 * Looks through a query "where" for $like and $notLike values that can be translated to $regex strings.
 * @param where
 */
function translateQueryRegex(where) {
	for (var key in where) {
		if (where.hasOwnProperty(key)) {
			var val = where[key];
			if (key === '$like' || key === '$notLike') {
				var regex = '^' + val
						.replace(/%{2}/g, '\\%')
						.replace(/(^|[^\\])%/g, '$1.*')
						.replace(/(^|[^\\])_/g, '$1.') + '$';
				if (key === '$like') {
					where.$regex = regex;
					delete where.$like;
				}
				else {
					where.$not = {$regex: regex};
					delete where.$notLike;
				}
			}
			else if (_.isArray(val)) {
				for (var i = 0; i < val.length; i++) {
					if (_.isObject(val[i])) {
						translateQueryRegex(val[i]);
					}
				}
			}
			else if (_.isObject(val)) {
				translateQueryRegex(val);
			}
		}
	}
}


function prepareQueryOptions(ctx, options) {
	// Look for JSON for us to parse.
	parseProperties(options);

	var validOptions = {where: 1, sel: 1, unsel: 1, page: 1, per_page: 1, order: 1, skip: 1, limit: 1};

	// Allow mixed casing on the parameters.
	for (var casedKey in options) {
		if (options.hasOwnProperty(casedKey)) {
			if (!validOptions[casedKey] && validOptions[casedKey.toLowerCase()]) {
				options[casedKey.toLowerCase()] = options[casedKey];
				delete options[casedKey];
			}
		}
	}

	// Did they just pass in some fields and their values? Wrap it before passing to query.
	if (!_.any(validOptions, function (val, key) {
			return options[key] !== undefined;
		})) {
		options = {where: options};
	}

	// Translate sel and unsel, if specified.
	if (options.sel !== undefined && typeof options.sel === 'string') {
		options.sel = translateCSVToObject(options.sel);
	}
	if (options.unsel !== undefined && typeof options.unsel === 'string') {
		options.unsel = translateCSVToObject(options.unsel);
	}

	if (ctx.defaultQueryOptions) {
		options = _.merge(ctx.defaultQueryOptions, options);
	}

	// Ensure limit and per_page are set.
	options.limit = options.per_page = +options.limit || +options.per_page || 10;

	// Ensure page and skip are set.
	if (options.page === undefined && options.skip !== undefined) {
		options.skip = +options.skip;
		options.page = Math.floor(options.skip / options.limit) + 1;
	}
	else if (options.skip === undefined && options.page !== undefined) {
		options.page = +options.page;
		options.skip = (options.page - 1) * options.per_page;
	}
	else {
		options.page = 1;
		options.skip = 0;
	}

	if (ctx.getConnector().translateWhereRegex && options.where !== undefined) {
		translateQueryRegex(options.where);
	}

	return options;
}
