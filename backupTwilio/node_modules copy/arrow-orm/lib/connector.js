'use strict';

/**
 * @class Arrow.Connector
 */
var util = require('util'),
	events = require('events'),
	_ = require('lodash'),
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	error = require('./error'),
	Collection = require('./collection'),
	ORMError = error.ORMError,
	Capabilities = require('./connector/capabilities'),
	utillib = require('./util'),
	connectors = [],
	ConnectorClass = new events.EventEmitter(),
	delegateMethods = [
		'create', 'save', 'update', 'upsert', 'findAndModify', 'findByID', 'findById', 'findOne', 'findOneMany',
		'findManyByID', 'findManyById', 'findAll', 'find', 'query', 'delete', 'deleteAll', 'distinct', 'upsert',
		'count', 'createMany', 'deleteMany'
	];

util.inherits(Connector, events.EventEmitter);

module.exports = Connector;

function Connector(impl, config) {
	impl && _.merge(this, _.omit(impl, 'connect', 'disconnect', 'loginRequired'));
	// setup our methods to delegate through...
	var methods = impl && _.pick(impl, delegateMethods);
	var self = this;
	if (methods) {
		Object.keys(methods).forEach(function connectorMethodIterator(method) {
			var fn = methods[method];
			if (typeof(fn) === 'function') {
				// if a function, delegate through our wrapper
				wrapDelegate(self, method, fn);
			} else {
				// just assign
				self[method] = fn;
			}
		});
	}

	// incoming constructor config should overwrite implementation
	this.config = _.merge(impl && impl.config || {}, config);
	if (!this.pkginfo && this.config && this.config.pkginfo) {
		this.pkginfo = this.config.pkginfo;
	}

	// pull in these into the connector if we don't have them but we have them in our
	// package
	['description', 'version', 'name', 'author'].forEach(function (k) {
		if (!self[k] && self.pkginfo && (k in self.pkginfo)) {
			self[k] = self.pkginfo[k];
		}
	});

	// re-map connect/disconnect for lifecycle
	this._connect = impl && impl.connect;
	this._disconnect = impl && impl.disconnect;
	this.connected = false;

	// incoming constructor config should overwrite implementation
	this.config = _.merge(impl && impl.config || {}, config);

	// if we provided a constructor in our impl, use it
	if (this.constructor && this.constructor !== Connector && !this.constructor.super_) {
		this.constructor.call(this);
		Connector.constructor.call(this);
	}

	if (!this.name) {
		throw new ORMError('connector is required to have a name');
	}

	// map login required
	if (impl && _.isFunction(impl.loginRequired)) {
		this.delegatedloginRequired = impl.loginRequired;
	}

	/**
	 * The arrow-orm needs another look to properly handle both findById and findOne apis.
	 * Currently when a connector version with the old findOne interface is used, the "Find by id"
	 * won't show up in the list of APIs for a model. So we need to manually add it.
	 */
	this.on('init-model', function (model) {
		if(!this.findByID && !this.findById && this.findOne) {
			model.findOneAPI = model.findByIDAPI;
		}
	}.bind(this));

	connectors.push(this);
	ConnectorClass.emit('register', this);
}

/**
 * suitable for JSON.stringify
 */
Connector.prototype.toJSON = function () {
	return {
		name: this.name
	};
};

/**
 * suitable for util.inspect
 */
Connector.prototype.inspect = function () {
	return '[object Connector:' + this.name + ']';
};

Connector.prototype.loginRequired = function (callback) {
	if (this.delegatedloginRequired && this._promise) {
		return this.delegatedloginRequired(this.request, callback);
	} else {
		return callback(null, false);
	}
};

function wrapDelegate(connector, method, delegate_) {
	connector['delegated' + method] = delegate_;
	connector[method] = function methodWrapper() {
		var delegate = this['delegated' + method];
		// check if we're connected and if so, go ahead and delegate
		if (this.connected && !this.loginRequired) {
			return delegate.apply(this, arguments);
		}
		// we're not connected, call through to connect before continuing
		else {
			var callback = arguments[arguments.length - 1],
				args = arguments,
				self = this,
				connect = function () {
					if (connector.connect) {
						connector.connect(function (err) {
							if (err) { return callback && callback(err); }
							delegate.apply(self, args);
						});
					} else {
						delegate.apply(self, args);
					}
				};
			if (self.loginRequired) {
				self.loginRequired(function (err, required) {
					if (err) { return callback(err); }
					if (required) {
						self.login(self.request, self.response, function (err) {
							if (err) { return callback(err); }
							connect();
						});
					} else {
						connect();
					}
				});
			} else {
				connect();
			}
		}
	};
}

/*
 * Defines various connector capabilities that you can enable to progressively be guided through connector development.
 */
Connector.Capabilities = Capabilities.Capabilities;

/*
 * Generates tests based on the defined capabilities of the connector, and based upon minimal configuration.
 */
Connector.generateTests = Capabilities.generateTests;

/**
 * Returns the active Arrow Connectors.
 * @static
 * @returns {Array<Arrow.Connector>}
 */
Connector.getConnectors = function getConnectors() {
	return connectors;
};

/**
 * Binds a callback to an event.
 * @static
 * @param {String} name Event name
 * @param {Function} cb Callback function to execute.
 */
Connector.on = function on() {
	ConnectorClass.on.apply(ConnectorClass, arguments);
};

/**
 * Unbinds a callback from an event.
 * @static
 * @param {String} name Event name
 * @param {Function} cb Callback function to remove.
 */
Connector.removeListener = function removeListener() {
	ConnectorClass.removeListener.apply(ConnectorClass, arguments);
};

/**
 * Unbinds all event callbacks for the specified event.
 * @static
 * @param {String} [name] Event name.  If omitted, unbinds all event listeners.
 */
Connector.removeAllListeners = function removeAllListeners() {
	ConnectorClass.removeAllListeners.apply(ConnectorClass, arguments);
};

// NOTE: this is internal and only used by the test and should never be called directly
Connector.clearConnectors = function clearConnectors() {
	connectors.length = 0;
};

/*
 * called to create a wrapper around this instance which will enforce login, etc.
 */
Connector.prototype.createRequest = function createRequest(request, response) {
	var connector = Object.create(this);
	connector.request = request;
	connector.response = response;
	connector._promise = true;

	delegateMethods.forEach(function (name) {
		var fn = connector[name];
		fn && utillib.createTransactionLoggedDelegate(connector, 'connector', connector, name);
	});

	return connector;
};

Connector.prototype.endRequest = function createRequest() {
	this.request = this.response = null;
	this.removeAllListeners();
};

/**
 * Creates a new connector.
 * @static
 * @param {Object} impl Implementation object. See the overview at the top of the page.
 * @throws {Arrow.ORMError} Missing name parameter.
 */
Connector.extend = function classExtend(impl) {
	// Validate.
	if (!impl) {
		throw new TypeError('Missing required parameter "impl" to Connector.extend!');
	}

	// Provide some good defaults.
	if (impl.filename) {
		if (!impl.pkginfo) {
			impl.pkginfo = _.pick(
				require('pkginfo').read(impl).package,
				'name', 'version', 'description', 'author', 'license', 'keywords', 'repository'
			);
		}

		// Load up (well, delayed load up)
		var modelsDir = path.resolve(path.join(impl.filename, '..', '..', 'models'));
		if (!impl.models && fs.existsSync(modelsDir) && Connector.Arrow) {
			impl.modelsDir = modelsDir;
			// loadModelsForConnector will most likely defer loading the models until after getConnector finishes.
			// So if impl.models is undefined after this, don't fret, it will be soon.
			impl.models = Connector.Arrow.loadModelsForConnector(impl.name || impl.pkginfo.name, impl);
		}

		// Look for an example config file.
		var exampleConfig = path.resolve(path.join(impl.filename, '..', '..', 'conf', 'example.config.js'));
		if (!impl.defaultConfig && fs.existsSync(exampleConfig)) {
			impl.defaultConfig = fs.readFileSync(exampleConfig, 'UTF-8');
		}

		// Allow convention based loading of modules from directories.
		['lifecycle', 'metadata', 'schema', 'utility', 'methods'].forEach(function (dir) {
			var subDir = path.resolve(path.join(impl.filename, '..', dir));
			if (!fs.existsSync(subDir)) {
				return;
			}
			fs.readdirSync(subDir)
				.filter(function (f) {
					return f.slice(-3) === '.js';
				})
				.forEach(function (f) {
					try {
						var module = require(path.join(subDir, f));
						for (var key in module) {
							if (module.hasOwnProperty(key) && _.isFunction(module[key]) && !impl[key]) {
								impl[key] = module[key];
							}
						}
					}
					catch (err) {
						console.error('Failed to load connector sub directory module; skipping it:');
						console.error(err);
					}
				});
		});
	}

	// if we have a logger from arrow, use it
	if (!impl.logger && Connector.Arrow && Connector.Arrow.getGlobal()) {
		impl.logger = Connector.Arrow.getGlobal().logger;
	}

	// Validate our capabilities.
	if (impl.capabilities) {
		Capabilities.validateCapabilities(impl);
	}

	// Recursively apply extend, so connectors can extend connectors.
	function ConnectorConstructor(config) {
		return new Connector(impl, config);
	}

	ConnectorConstructor.extend = function (extendingImpl) {
		return classExtend(_.merge(impl, extendingImpl));
	};

	return ConnectorConstructor;
};

/**
 * Creates a new connector from this instance.
 * @param {Object} impl Implementation object. See the overview at the top of the page.
 * @throws {Arrow.ORMError} Missing name parameter.
 */
Connector.prototype.extend = function instanceExtend(impl) {
	return Connector.extend(_.merge(this, impl));
};

/**
 * Returns true if connected.
 * @returns {Boolean}
 */
Connector.prototype.isConnected = function isConnected() {
	return this.connected;
};

/**
 * Outputs the default connector configuration to the console.
 */
Connector.prototype.logDefaultConfig = function logDefaultConfig() {
	if (this.defaultConfig) {
		this.logger.info('The ' + this.name + ' connector recommends the following configuration. Copy and paste it in to your conf/default.js or other configuration file.');
		// Note: We do a normal console.log here because the logger can inject little characters around \t and \n.
		console.log(this.defaultConfig);
		this.logger.info('You may need to change some of the values for your particular needs.');
	}
};

/**
 * Returns the primary key of a Model. Override this method to provide a different value.
 * @param {Arrow.Model} Model Model class.
 * @param {Object} record Record to check.
 * @returns {String}
 */
Connector.prototype.getPrimaryKey = function getPrimaryKey(Model, record) {
	return record[this.getPrimaryKeyColumnName()];
};

/**
 * Connects to the external data source.
 *
 * The connect lifecycle will call the following methods before the server starts
 * (if provided by the implementation):
 *
 * 1. {@link Arrow.Connector#fetchMetadata}
 * 2. {@link Arrow.Connector#fetchConfig}
 * 3. connect
 * 4. {@link Arrow.Connector#fetchSchema}
 * @param {Function} callback Callback function passed an Error object (or null if successful).
 * The callback is invoked after each operation.
 */
Connector.prototype.connect = function (callback) {
	if (this.connected || this.config.enabled === false) {
		return callback();
	}
	var tasks = [];
	if (this.fetchMetadata) {
		tasks.push(function fetchMetadataTask(next) {
			this.fetchMetadata(function fetchMetadataTaskCallback(err, metadata) {
				if (err) { return next(err); }
				if (metadata) {
					this.metadata = _.merge(this.metadata || {}, metadata);
				}
				next();
			}.bind(this));
		}.bind(this));
	}
	else {
		// no metadata, let's just make an empty one
		tasks.push(function metadataTask(next) {
			if (!this.metadata) {
				this.metadata = {schema: undefined};
			}
			next();
		}.bind(this));
	}
	if (this.fetchConfig) {
		tasks.push(function fetchConfigTask(next) {
			this.fetchConfig(function fetchConfigTaskCallback(err, config) {
				if (err) { return next(err); }
				// basically, the constructors config should override
				// our default config from the connector
				this.config = _.merge(config, this.config);
				var possibleErr = this.validateConfig();
				if (possibleErr !== true) {
					next(possibleErr);
				}
				else {
					next();
				}
			}.bind(this));
		}.bind(this));
	}
	else {
		tasks.push(function configTask(next) {
			if (!this.config) {
				this.config = {};
			}
			var possibleErr = this.validateConfig();
			if (possibleErr !== true) {
				next(possibleErr);
			}
			else {
				next();
			}
		}.bind(this));
	}
	if (this._connect) {
		tasks.push(function connectTask(next) {
			try {
				this._connect(next);
			}
			catch (err) {
				next(err);
			}
		}.bind(this));
	}
	if (this.fetchSchema) {
		tasks.push(function fetchSchemaTask(next) {
			this.fetchSchema(function fetchSchemaTaskCallback(err, schema) {
				if (err) { return next(err); }
				if (schema) {
					this.metadata = _.merge(this.metadata || {}, {schema: schema});
					this.schema = schema;
				}
				if (!this._createdModelsFromSchema && this.createModelsFromSchema && (this.config.generateModelsFromSchema === undefined || this.config.generateModelsFromSchema)) {
					var proceed = function () {
						this._createdModelsFromSchema = true;
						var server = Connector.Arrow && Connector.Arrow.getGlobal();
						if (server && this.models) {
							server.registerModelsForConnector(this, this.models);
						}
						next();
					}.bind(this);
					if (this.createModelsFromSchema.length > 0) {
						this.createModelsFromSchema(proceed);
					}
					else {
						this.createModelsFromSchema();
						proceed();
					}
				}
				else {
					next();
				}
			}.bind(this));
		}.bind(this));
	}
	async.series(tasks, function connectCallback(err) {
		if (err) { return callback(err); }
		this.connected = true;
		callback();
	}.bind(this));
};

/**
 * Disconnects from the external data source.
 * @param {Function} callback Callback function to be called at the end of the operation.
 */
Connector.prototype.disconnect = function disconnect(callback) {
	if (!this.connected || this.config.enabled === false) {
		return callback();
	}
	var tasks = [];
	if (this._disconnect) {
		tasks.push(function disconnectTask(next) {
			this._disconnect(next);
		}.bind(this));
	}
	async.series(tasks, function disconnectCallback(err) {
		if (err) { return callback(err); }
		this.connected = false;
		callback();
	}.bind(this));
};

/**
 * @method validateConfig
 * Validates whether or not the config for this connector is valid, based on its metadata.
 * @returns {Boolean/Error} Returns true if the config is valid, otherwise returns an Error.
 */
Connector.prototype.validateConfig = function validateConfig() {
	var metadata = this.metadata,
		config = this.config || {};

	if (!metadata || !metadata.fields || !metadata.fields.length) {
		return true;
	}

	for (var i = 0; i < metadata.fields.length; i++) {
		var field = metadata.fields[i];
		if (!config[field.name]) {
			if (field.required) {
				this.logDefaultConfig();
				return new Error(field.name + ' is a required config property for the ' + this.name + ' connector!');
			}
			if (field.default !== undefined) {
				config[field.name] = field.default;
			}
		}
		else if (field.validator) {
			var validator;
			if (_.isRegExp(field.validator)) {
				validator = field.validator;
			}
			else if (field.validator.type === 'regexp') {
				validator = new RegExp(field.validator.value, field.validator.flags);
			}
			else {
				return new Error('The connector ' + this.name + ' has an invalid validator for ' + field.name + '!');
			}
			if (!validator.test(config[field.name])) {
				this.logDefaultConfig();
				return new Error('The value "' + config[field.name] + '" for ' + field.name + ' is invalid for the ' + this.name + ' connector!');
			}
		}
	}

	return true;
};

/**
 * Returns the column that is used as the primary key internally (not in the model, but in the native data source).
 * This is used by the model when translating the query for selecting/unselecting columns.
 * @param {Arrow.Model} Model Model class to check.
 * @returns {String} Key name in the data source used as the primary key.
 */
Connector.prototype.getPrimaryKeyColumnName = function (Model) {
	return this.idAttribute || 'id';
};

/**
 * Creates a list of instances by a set of values.
 * @since 1.2.8
 * @param {Arrow.Model} Model Model class to check.
 * @param {Array} values Set of instances to create
 * @param {Function} callback Callback passed an Error object (or null if successful).
 */
Connector.prototype.createMany = function createMany(Model, values, callback) {
	async.mapLimit(values, 4, Model.create.bind(Model), callback);
};

/**
 * Removes a list of instances by a set of ids.
 * @since 1.2.8
 * @param {Arrow.Model} Model Model class to check.
 * @param {Array} ids Set of primary keys to delete
 * @param {Function} callback Callback passed an Error object (or null if successful).
 */
Connector.prototype.deleteMany = function deleteMany(Model, ids, callback) {
	async.mapLimit(ids, 4, function (id, next) {
		Model.findByID(id, function (err, result) {
			if (err || !result) {
				return next();
			}
			Model.delete(id, next);
		});
	}.bind(Model), callback);
};

/**
 * Finds a list of instances by a set of ids.
 * @since 1.2.8
 * @param {Arrow.Model} Model Model class to check.
 * @param {Array} ids Set of primary keys to find
 * @param {Function} callback Callback passed an Error object (or null if successful).
 */
Connector.prototype.findManyByID = Connector.prototype.findManyById = Connector.prototype.findOneMany = function findOneMany(Model, ids, callback) {
	async.mapLimit(ids, 4, Model.findByID.bind(Model), callback);
};

/**
 * Performs a find and update in the same query.
 * @param {Arrow.Model} Model Model class to check.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Object} doc Model fields to modify.
 * @param {Object} [args] Optional parameters.
 * @param {Boolean} [args.new=false] Set to `true` to return the new model instead of the original model.
 * @param {Boolean} [args.upsert=false] Set to `true` to allow the method to create a new model.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
Connector.prototype.findAndModify = function findAndModify(Model, options, doc, args, callback) {
	if (_.isFunction(args)) {
		callback = args;
		args = {};
	}
	options.limit = 1;
	this.query(Model, options, function (err, result) {
		if (err) {
			return callback(err);
		}

		var hasAResult = result && result.length,
			allowInserting = args.upsert || args.insert === true,
			allowUpdating = args.update === undefined || args.update === true;

		if (!hasAResult && allowInserting) {
			return this.create(Model, doc, function (err, record) {
				callback(err, args.new ? record : {});
			});
		}

		if (hasAResult && allowUpdating) {
			result[0].set(doc, false);
			return this.save(Model, result[0], function (err, record) {
				callback(err, args.new ? record : result[0]);
			});
		}

		callback();

	}.bind(this));
};

/**
 * Performs a query and returns a distinct result set based on the field(s).
 * @param {Arrow.Model} Model Model class to check.
 * @param {String} field Comma-separated list of fields.
 * @param {ArrowQueryOptions} [options] Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the distinct models.
 */
Connector.prototype.distinct = function distinct(Model, field, options, callback) {
	if (_.isFunction(options)) {
		callback = options;
		options = {};
	}
	this.query(Model, options, function (err, results) {
		if (err) {
			return callback(err);
		}
		else if (!results) {
			return callback();
		}
		var found = {},
			array = [],
			model = results.model,
		// fields can be a comma-separated string of each field to use in distinct
			keys = field.split(',').map(function (k) {return k.trim();});

		for (var c = 0; c < results.length; c++) {
			var row = results[c],
				key;

			if (keys.length > 1) {
				key = [];
				keys.forEach(function (n) {
					key.push(row.get(n));
				});
				key = key.join(',');
			}
			else {
				key = row.get(field);
			}

			if (key in found) {
				continue;
			}
			found[key] = key;
			array.push(row);
		}

		results = array;
		callback(null, Array.isArray(results) ? results : new Collection(model, results));
	});
};

/**
 * Performs a query and returns a count of the records. In the options parameter, set the
 * `distinct` property to `true` to perform a distinct count.
 * @param {Arrow.Model} Model Models to check.
 * @param {ArrowQueryOptions} [options] Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the number of models found.
 */
Connector.prototype.count = function count(Model, options, callback) {
	if (_.isFunction(options)) {
		callback = options;
		options = {};
	}
	this.query(Model, options, function (err, results) {
		if (err) {
			return callback(err);
		}
		else {
			var count = results.length;
			if (options.distinct) {
				var found = {};
				count = 0;
				for (var c = 0; c < results.length; c++) {
					var row = results[c],
						value = row.get(options.distinct);
					if (value in found) {
						continue;
					}
					found[value] = 1;
					count++;
				}
			}
			callback(null, count);
		}
	});
};

/**
 * Creates or updates a model.
 * @param {Arrow.Model} Model Model to search.
 * @param {String} id ID of the model to update (or create).
 * @param {Object} document Fields to set in the model.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the new model.
 */
Connector.prototype.upsert = function upsert(Model, id, document, callback) {
	Model.findByID(id, function (err, record) {
		if (err) {
			return callback(err);
		}
		if (!record && document) {
			document.id = id;
			Model.create(document, callback);
		} else {
			record.set(document);
			record.save(function (err) {
				callback(err, record);
			});
		}
	});
};
