/**
 * @class Arrow.Collection
 */
'use strict';

var _ = require('lodash'),
	EventEmitter = require('events').EventEmitter,
	error = require('./error'),
	Instance = require('./instance');

module.exports = Collection;

/* istanbul ignore next */
var getPrototypeOf = Object.getPrototypeOf || function (o) {
		return o.__proto__;
	};
/* istanbul ignore next */
var setPrototypeOf = Object.setPrototypeOf || function (o, p) {
		o.__proto__ = p;
		return o;
	};

function Collection(model, instances) {
	if (!instances && Array.isArray(model)) {
		instances = model;
		model = null;
	}
	var array = [];
	var isNew = this instanceof Collection;
	var proto = isNew ? getPrototypeOf(this) : Collection.prototype;
	var self = setPrototypeOf(array, proto);
	Object.defineProperty(self, 'model', {
		value: model,
		enumerable: false
	});
	instances && self.add(instances);
	return self;
}

Collection.prototype = Object.create(Array.prototype, {constructor: {value: Collection}});

/**
 * Returns a copy of the collection as a vanilla array.
 * @returns {Array<Arrow.Instance>} A copy of the collection.
 */
Collection.prototype.toArray = function () {
	return [].concat(this);
};

/**
 * Returns the instance at the specified index. If the index is out-of-bounds, it returns undefined.
 * @param {Number} idx The index in the collection to retrieve.
 * @returns {Arrow.Instance}
 */
Collection.prototype.get = function (index) {
	return this[index];
};

/**
 * @method add
 * Adds an instance to the collection.
 * @param {Array<Arrow.Instance>/Arrow.Instance} instances The model instance(s) to add.
 * @returns {Arrow.Collection}
 * @throws {Arrow.ORMError} Passed object or array element was not a Model instance.
 */
/**
 * @method push
 * @alias #add
 */
Collection.prototype.push =
	Collection.prototype.add = function (instances) {
		Array.isArray(instances) || (instances = [instances]);

		for (var c = 0; c < instances.length; c++) {
			var instance = instances[c];
			// check that the instances is an array and each element is an Instance object
			if (!(instance instanceof Instance)) {
				throw new error.ORMError('Collection only takes an array of Model instance objects');
			}
			Array.prototype.push.call(this, instance);
		}

		return this;
	};

function objectCustomizer(obj) {
	if (obj instanceof Instance) {
		return obj.toJSON();
	}
	else if (Array.isArray(obj)) {
		var array = [];
		// NOTE: don't just use map since it could be a collection object
		obj.forEach(function (o) {
			array.push(_.cloneDeep(o, objectCustomizer));
		});
		return array;
	}
	else if (obj.toJSON) {
		return obj.toJSON();
	}
	else if (_.isFunction(obj)) {
		return undefined;
	}
	else if (_.isObject(obj)) {
		return _.cloneDeep(obj, objectCustomizer);
	}
	return obj;
}

/**
 * Returns a JSON version of the collection.
 * @returns {Array<Object>} The collection.
 */
Collection.prototype.toJSON = function toJSON() {
	return _.cloneDeep(this, objectCustomizer);
};

/**
 * @method concat
 * Returns a collection that is joined with all the passed collections.
 * @param {...Arrow.Collection} Collections Collection(s) to join.
 * @returns {Arrow.Collection}
 */

/**
 * @method reverse
 * Reverses the items in the collection.
 * @returns {Arrow.Collection}
 */

/**
 * @method slice
 * Returns a shallow copy of a portion of a collection into a new collection object.
 * @param {Number} [start] Start index.  If omitted, set to `0`.
 * If set to a negative value, offsets from the end of the collection.
 * @param {Number} [end] End index. If omitted, extracts to the end of the collection.
 * If set to a negative value, offsets from the end of the collection.
 * @returns {Arrow.Collection}
 */

/**
 * @method splice
 * Modifies the collection by removing elements and optionally inserting new ones.
 * @param {Number} start Start index.
 * @param {Number} count Number of elements to remove.
 * @param {...Arrow.Instance} [items] Model instances to insert.
 * @returns {Arrow.Collection}
 */

/**
 * @method sort
 * Returns a sorted collection.
 * @param {Function} [callback] Comparator function to define the sort order where the
 * function is passed two elements `a` and `b`, then returns:
 *
 *   * a negative value if `a` should be before `b`
 *   * a zero value to leave the elements unchanged
 *   * a positive value if `b` should be before `a`
 *
 * If undefined, the values are sorted based on the string value of the elements.
 * @returns {Arrow.Collection}
 */

/**
 * @method filter
 * Creates a new collection with elements that pass the test from the provided function.
 * @param {Function} callback Function to test each element of the collection.  The function is passed
 * a collection element, element index and collection. Return `true` to keep the element else false.
 * @param {Object} [thisArg] Value to use as `this` when executing the callback.
 * @returns {Arrow.Collection}
 */

/**
 * @method map
 * Creates a new collection with the results of the provided callback.
 * @param {Function} callback Function to manipulate each element of the collection.  The function is passed
 * a collection element, element index and collection. Return the new value or element.
 * @param {Object} [thisArg] Value to use as `this` when executing the callback.
 * @returns {Arrow.Collection}
 */
["concat", "reverse", "slice", "splice", "sort", "filter", "map"].forEach(function (name) {
	var _Array_func = this[name];
	Collection.prototype[name] = function () {
		var result = _Array_func.apply(this, arguments);
		return setPrototypeOf(result, getPrototypeOf(this));
	};
}, Array.prototype);
