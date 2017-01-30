/**
 * @class Arrow.Instance
 */
var util = require('util'),
	events = require('events'),
	error = require('./error'),
	ORMError = error.ORMError,
	ValidationError = error.ValidationError,
	_ = require('lodash');

util.inherits(Instance, events.EventEmitter);
module.exports = Instance;

var builtInTypes = ['string', 'number', 'boolean', 'object', 'date', 'array'];

function Instance(model, values, skipNotFound) {
	if (!model.fields) {
		throw new ORMError('missing model "fields" property');
	}
	this._values = {};
	this._model = model;
	this._dirty = false;
	this._deleted = false;
	this._metadata = {};
	this._dirtyfields = {};
	this._fieldmap = {};
	this._fieldmap_by_name = {};
	this._skipNotFoundFields = null;
	this._events = {};

	var self = this;
	['_values', '_model', '_dirty', '_deleted', '_metadata', '_dirtyfields', '_fieldmap', '_fieldmap_by_name', '_skipNotFoundFields', '_events'].forEach(function (k) {
		Object.defineProperty(self, k, {
			enumerable: false
		});
	});

	// map our field properties into this instance
	Object.keys(model.fields).forEach(function instanceIterator(property) {
		var field = model.fields[property];
		if (!field.type) {
			throw new ValidationError(property, "required type property missing for field");
		}
		if (!field.type.name) {
			field.type = String(field.type);
		}
		else {
			field.type = field.type.name.toLowerCase();
		}
		if (_.isString(field.model)) {
			if (Instance.Arrow && Instance.Arrow.getModel(field.model)) {
				field.Model = Instance.Arrow.getModel(field.model);
			}
			else if (model.connector && model.connector.models && model.connector.models[field.model]) {
				field.Model = model.connector.models[field.model];
			}
		}
		else if (_.isObject(field.model)) {
			field.Model = field.model;
			field.model = field.Model.name;
		}
		if (field.default !== undefined) {
			this._values[property] = field.default;
		}
		if (field.name) {
			this._fieldmap[field.name] = property;
			this._fieldmap_by_name[property] = field;
		}
		Object.defineProperty(this, property, {
			get: function () {
				return this.get(property);
			},
			set: function (value) {
				return this.set(property, value);
			}
		});
	}.bind(this));

	// map in the methods from the Model on to the instance
	model.methods && Object.keys(model.methods).forEach(function modelMethodIterator(name) {
		var o = model.methods[name];
		if (_.isFunction(o)) {
			this[name] = o.bind(this);
		}
		else {
			this[name] = o;
		}
	}.bind(this));

	// set the values
	values && this.set(values, skipNotFound);

	// set dirty false when we are constructing
	this._dirty = false;
	this._dirtyfields = {};
	this._skipNotFoundFields = skipNotFound && Object.keys(values);

	// perform initial validation
	!skipNotFound && this.validateFields();
}

function isOK(value) {
	return !(value === undefined || value === null);
}

/**
 * Retrieves the Model class used by this model instance.
 * @returns {Arrow.Model}
 */
Instance.prototype.getModel = function getModel() {
	return this._model;
};

/**
 * Retrieves the Connector class used by this model instance.
 * @returns {Arrow.Connector}
 */
Instance.prototype.getConnector = function getConnector() {
	return this._model.getConnector();
};

/**
 * Validates if the model field can be implictly converted to the value.
 * If it can, sets the converted value.
 * @param {Any} field Field value to validate.
 * @param {String} name Field name to set.
 * @param {Any} value Value to validate.
 * @returns {Boolean} Returns `true` if the type can be implicitly converted else `false`.
 */
Instance.prototype.validateCoersiveTypes = function validateCoersiveTypes(field, name, value) {
	var type = (typeof value).toLowerCase();
	switch (field.type.toLowerCase()) {
		case 'boolean':
		{
			if (type === 'number') {
				this.set(name, value >= 1);
				return true;
			}
			if (type === 'string') {
				switch (value.trim().toLowerCase()) {
					case 'false':
					case 'no':
					case '0':
						this.set(name, false);
						return true;
					case 'true':
					case 'yes':
					case '1':
						this.set(name, true);
						return true;
				}
			}
			break;
		}
		case 'number':
		{
			if (type === 'string') {
				var parsedInt = parseInt(value, 10);
				if (value == parsedInt) { // jshint ignore:line
					this.set(name, parsedInt);
					return true;
				}
				var parsedFloat = parseFloat(value);
				if (value == parsedFloat) { // jshint ignore:line
					this.set(name, parsedFloat);
					return true;
				}
			}
			break;
		}
		case 'date':
		{
			if (type === 'number') {
				this.set(name, new Date(value));
				return true;
			}
			else if (value instanceof Date) {
				return true;
			}
			break;
		}
		case 'object':
		{
			if (value instanceof Date) {
				return true;
			}
			if (typeof(value) === 'string' && value === '') {
				this.set(name, {});
				return true;
			}
			break;
		}
		case 'array':
		{
			if (Array.isArray(value)) {
				return true;
			}
			break;
		}
	}
	return false;
};

/**
 * Validates a field in the model. Throws a validation error if validation fails.
 * @param {String} name Field name to validate.
 * @param {Any} v Value to validate.
 * @throws {Arrow.ValidationError}
 */
Instance.prototype.validateField = function validateField(name, v) {
	var field = this._model.fields[name],
		value = isOK(v) ? v : this.get(name),
		hasValue = isOK(value);
	if ((false === field.optional || field.required) && !hasValue) {
		throw new ValidationError(name, "required field value missing: " + name);
	}
	if (hasValue && field.type.toLowerCase() !== (typeof value).toLowerCase()) {
		var isBuiltInType = builtInTypes.indexOf(field.type.toLowerCase()) >= 0,
			builtInCoerce = isBuiltInType && this.validateCoersiveTypes(field, name, value),
			externalCoerce = !isBuiltInType && this._model.connector && this._model.connector.coerceCustomType && this._model.connector.coerceCustomType(this, field, name, value);
		if (!builtInCoerce && !externalCoerce) {
			throw new ValidationError(name, "invalid type (" + (typeof value) + ") for field: " + name + ". Should be " + field.type + ". Value was: " + util.inspect(value));
		}
	}
	if (value !== undefined && value !== null && (_.isString(value) || _.isArray(value))) {
		if (field.minlength !== undefined && value.length < field.minlength) {
			throw new ValidationError(name, "field value must be at least " + field.minlength + " characters long: " + name);
		}
		if (field.maxlength !== undefined && value.length > field.maxlength) {
			throw new ValidationError(name, "field value must be at most " + field.maxlength + " characters long: " + name);
		}
		if (field.length !== undefined && value.length !== field.length) {
			throw new ValidationError(name, "field value must be exactly " + field.length + " characters long: " + name);
		}
	}
	// Run validation on sub-models, if we have them.
	if (field.Model && field.Model.instance) {
		if (_.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				field.Model.instance(value[i], false);
			}
		}
		else if (_.isObject(value)) {
			field.Model.instance(value, false);
		}
	}
	if (field.validator) {
		// only run validators if required or if we have a value
		if (field.required || hasValue) {
			if (field.validator instanceof RegExp) {
				if (!field.validator.test(value)) {
					throw new ValidationError(name, 'field "' + name + '" failed validation using expression "' + field.validator + '" and value: ' + value);
				}
			} else if (typeof field.validator === 'function') {
				var msg;
				try {
					msg = field.validator(value);
				}
				catch (E) {
					if (E instanceof ValidationError) {
						throw E;
					}
					else {
						throw new ValidationError(name, E.message);
					}
				}
				if (msg) {
					throw new ValidationError(name, msg);
				}
			}
		}
	}
};

/**
 * Validates the fields in the model.
 * @returns {Boolean} Returns `true` if all fields are valid else `false`.
 * @throws {Arrow.ValidationError}
 */
Instance.prototype.validateFields = function validateFields() {
	// map our field properties into this instance
	var errors = [];
	Object.keys(this._model.fields).forEach(function iterator(property) {
		try {
			this.validateField(property);
		}
		catch (err) {
			errors.push(err);
		}
	}.bind(this));
	if (errors.length > 0) {
		if (errors.length === 1) {
			throw errors[0];
		}
		else {
			throw new ValidationError(_.pluck(errors, 'field').join(', '), _.pluck(errors, 'message').join('\n'));
		}
	}
};

/**
 * Sets the primary key for the model.
 * @param {String} field Field name to use as the primary key.
 */
Instance.prototype.setPrimaryKey = function setPrimaryKey(value) {
	this.setMeta(Instance.PRIMARY_KEY, value);
};

/**
 * Retrieves the field name used as the primary key.
 * @returns {String}
 */
Instance.prototype.getPrimaryKey = function getPrimaryKey() {
	return this.getMeta(Instance.PRIMARY_KEY);
};

['primaryKey', 'ID', 'Id', 'id', '_id'].forEach(function (alias) {
	Object.defineProperty(Instance.prototype, alias, {
		get: Instance.prototype.getPrimaryKey,
		set: Instance.prototype.setPrimaryKey
	});
});

/**
 * Sets metadata for the model instance.
 * @param {String} key Key to set.
 * @param {Any} value Value to set.
 * @returns {Arrow.Instance}
 */
Instance.prototype.setMeta = function setMeta(key, value) {
	this._metadata[key] = value;
	return this;
};

/**
 * Retrieves metadata from the model instance.
 * @param {String} key Key to retrieve.
 * @param {Any} def Default value to return if the key is not set.
 * Does not set the value of the key.
 * @returns {Any}
 */
Instance.prototype.getMeta = function getMeta(key, def) {
	return this._metadata[key] !== undefined ? this._metadata[key] : def;
};

/**
 * Returns a string representation of the model instance.
 * @returns {String}
 */
Instance.prototype.inspect = function inspect() {
	return util.inspect(this.toJSON());
};

/**
 * Converts the model instance to JSON.
 * @returns {Object}
 */
Instance.prototype.toJSON = function toJSON() {
	var obj = {},
		fields = this._model.fields,
		pk = this.getPrimaryKey();
	// only add the primary key if we have one
	if (pk !== undefined) {
		obj.id = pk;
	}
	for (var key in this._model.fields) {
		if (this._model.fields.hasOwnProperty(key)) {

			// if we have skip fields, only return fields contained in the model - that what
			// if we query with sel or unsel, we only return a model that also contains those same
			// field keys (assuming it's not a calculated field)
			var field = fields[key];
			if (this._skipNotFoundFields &&
				this._skipNotFoundFields.indexOf(key) < 0 &&
					// not custom and not primary key
				field && !field.custom && key !== 'id' &&
					// if its not a custom mapped field name
				field.name === key) {
				continue;
			}
			var v = this._model.get(key, this._values[key], this);
			if (!_.isFunction(v)) {
				if (v !== undefined) {
					// undefined means remove it
					obj[key] = v;
				}
			}
		}
	}

	// allow the model to have a global serialize callback
	if (this._model.serialize) {
		obj = this._model.serialize(obj, this, this._model);
	}
	return obj;
};

/**
 * Converts the model fields to a JSON payload.
 * @returns {Object}
 */
Instance.prototype.toPayload = function toPayload() {
	var obj = {},
		fields = this._model.fields,
		values = this.values();
	for (var key in values) {
		/*if (values.hasOwnProperty(key) && values[key] !== null && !fields[key].custom) {
		 obj[fields[key].name || key] = values[key];
		 }*/
		if (values.hasOwnProperty(key) && !fields[key].custom) {
			obj[fields[key].name || key] = this._model.set(key, this._values[key], this);
		}
	}
	// allow the model to have a global deserialize callback
	if (this._model.deserialize) {
		obj = this._model.deserialize(obj, this, this._model);
	}
	return obj;
};

/**
 * Returns `true` if the model instance has not been saved to the external source.
 * @returns {Boolean}
 */
Instance.prototype.isUnsaved = function isUnsaved() {
	return this._dirty;
};

/**
 * Returns `true` if the model instance has been deleted.
 * @returns {Boolean}
 */
Instance.prototype.isDeleted = function isDeleted() {
	return this._deleted;
};

/**
 * Retrieves the value of the model field.
 * @param {String} name Field name to retrieve.
 * @returns {Any}
 */
Instance.prototype.get = function get(name) {
	var field = this._model.fields[name],
		isBuiltInType = field && field.type && builtInTypes.indexOf(field.type.toLowerCase()) >= 0,
		result,
		notFound = true;
	if (field && field.get) {
		var Model = require('./model');
		var fn = Model.toFunction(field, 'get');
		result = fn(this._values[name], name, this);
		notFound = false;
	}
	if (undefined === result && name in this._values) {
		result = this._values[name];
		notFound = false;
	}
	if (!isBuiltInType && this._model.connector && this._model.connector.getCustomType) {
		result = this._model.connector.getCustomType(this, field, name, result);
	}
	else if (_.isObject(result)) {
		if (result.toJSON) {
			// if we've stored a model instance, don't clone it.
		}
		else {
			// we need to return a cloned value otherwise if you mutate it and then attempt
			// to update it, it won't think it's changed when you call set.
			result = JSON.parse(JSON.stringify(result));
		}
	}
	if (!notFound) {
		return result;
	}
	else {
		return undefined;
	}
};

/**
 * Changes a field with a new value. This will force the internal state to be dirty regardless of
 * whether the value is the same as what's already set.
 * @param {String} name Name of the model attribute.
 * @param {Any} value Value to set.
 */
Instance.prototype.change = function (name, value) {
	if (name in this._values) {
		this._values[name] = value;
		this._dirty = true;
		this._dirtyfields[name] = value;
	}
	else {
		throw new ORMError('field not found: ' + name);
	}
};

/**
 * Returns the fields that have been changed.
 * @returns {Object}
 */
Instance.prototype.getChangedFields = function getChangedFields() {
	return this._dirtyfields;
};

/**
 * Returns the values for the model instance excluding the primary key.
 * @param {Boolean} [dirtyOnly=false] Set to `true` to only return unsaved fields.
 * @returns {Object}
 */
Instance.prototype.values = function values(dirtyOnly) {
	var retVal = {};
	for (var key in this._model.fields) {
		if (this._model.fields.hasOwnProperty(key)) {
			var field = this._model.fields[key],
				isDirty = dirtyOnly && key in this._dirtyfields;
			if (field.readonly && isDirty) {
				retVal[key] = this._values[key];
				continue;
			}
			else if (field.readonly && !isDirty) {
				continue;
			}
			if (!dirtyOnly || isDirty) {
				retVal[key] = this._values[key];
			}
		}
	}
	return retVal;
};

/**
 * Returns the field keys for the instance.
 * @returns {Array<String>}
 */
Instance.prototype.keys = function keys() {
	return this._model.keys();
};

var internal = ['_dirty', '_deleted', '_metadata', '_dirtyfields', '_events', '_values', '_model', '_fieldmap', '_skipNotFoundFields'];

/**
 * Sets the values on the model instance.
 * @param {String} [name] Name of the field to set.
 * @param {Object/Any} value If `name` is used, the value to set for the field.
 * Otherwise, use an object of key-value pairs to set.
 * @param {Boolean} skipNotFound Set to `true` to skip fields passed in to
 * the `value` parameter that are not defined by the model's schema.  By default,
 * an error will be thrown if an undefined field is passed in.
 * @return {Arrow.Instance}
 * @throws {Arrow.ValidationError}
 */
Instance.prototype.set = function set() {
	var skipNotFound;
	if (typeof(arguments[0]) === 'object') {
		var obj = arguments[0];
		skipNotFound = arguments[1];
		var keys = _.keys(obj),
			errors = [];
		keys.forEach(function iterator(key) {
			try {
				this.set(key, obj[key], skipNotFound);
			}
			catch (err) {
				errors.push(err);
			}
		}.bind(this));
		if (errors.length > 0) {
			if (errors.length === 1) {
				throw errors[0];
			}
			else {
				throw new ValidationError(_.pluck(errors, 'field').join(', '), _.pluck(errors, 'message').join('\n'));
			}
		}
		if (skipNotFound) {
			// we need to remove any keys not found in the incoming payload
			// in case the user did a sel/unsel
			var removeKeys = _.difference(_.keys(this._values), keys);
			if (removeKeys.length) {
				removeKeys.forEach(function (k) {
					if (!(k in this._fieldmap_by_name)) {
						// only undefine if not in the field mapping
						this._values[k] = undefined;
					}
				}.bind(this));
			}
		}
		if (this._model.validator) {
			// only run validators if required or if we have a value
			if (typeof this._model.validator === 'function') {
				var msg;
				try {
					msg = this._model.validator(this);
				}
				catch (E) {
					if (E instanceof ValidationError) {
						throw E;
					}
					else {
						throw new ValidationError(this._model.name, E.message);
					}
				}
				if (msg) {
					throw new ValidationError(this._model.name, msg);
				}
			}
		}
	}
	else {
		var name = arguments[0];

		// if internal, we can skip
		if (name.charAt(0) === '_') {
			if (internal.indexOf(name) !== -1) {
				return;
			}
		}
		skipNotFound = arguments[2];

		// see if we have a field remapping
		if (name in this._fieldmap) {
			name = this._fieldmap[name];
		}

		var value = arguments[1],
			definition = this._model.fields[name],
			current_value = this._values[name];

		// don't set primary key, skip it
		if (name === 'id') {
			return;
		}

		if (!definition && !skipNotFound) {
			throw new ValidationError(name, "invalid field: " + name);
		}
		else if (!definition && skipNotFound) {
			// don't set it if we can't find definition and
			// we have told it to skip these types of fields
			// this is useful when a connector wants to add
			// values from DB but filter by the Model field
			// definitions and skip others
			return this;
		}
		if (!skipNotFound && definition.readonly) {
			throw new ValidationError(name, "cannot set read-only field: " + name);
		}

		value = isOK(value) ? value : definition.default;

		// do serialization
		if (!skipNotFound) {
			value = this._model.set(name, value, this);
		}

		if (/date/i.test(definition.type) && typeof value === 'string') {
			var dt = new Date(value);
			value = isNaN(dt) ? null : dt;
		}

		// validate this field
		!skipNotFound && this.validateField(name, value, skipNotFound);

		if (current_value !== value) {
			this._values[name] = value;
			this._dirty = true;
			this._dirtyfields[name] = value;
			this.emit('change:' + name, value, current_value);
		}
	}
	return this;
};

/**
 * @method save
 * Saves the model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated model.
 */
/**
 * @method update
 * @alias #save
 */
Instance.prototype.update =
	Instance.prototype.save = function save(callback) {
		return this._model.update(this, callback);
	};

/**
 * @method remove
 * Deletes the model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted model.
 */
/**
 * @method delete
 * @alias #remove
 */
Instance.prototype.delete =
	Instance.prototype.remove = function remove(callback) {
		return this._model.delete(this, callback);
	};

Instance.PRIMARY_KEY = 'primarykey';
