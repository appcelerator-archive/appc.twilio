var util = require('util'),
	_ = require('lodash'),
	events = require('events'),
	Mingo = require('mingo'),
	Model = require('../model'),
	Instance = require('../instance'),
	Collection = require('../collection'),
	Connector = require('../connector');

module.exports = MemoryConnector;
util.inherits(MemoryConnector, Connector);

var PK = 0;

Mingo.setup({
	key: 'id'
});

function MemoryConnector(config) {
	this.name = 'memory';
	this.description = 'In-Memory database connector';
	this.DB = {};
	this.config = config;
	Connector.apply(this, arguments);
}

MemoryConnector.resetPrimaryKeys = function () {
	PK = 0;
};

MemoryConnector.prototype.getTable = function (name) {
	var array = this.DB[name];
	if (!array) {
		array = [];
		this.DB[name] = array;
	}
	return array;
};

MemoryConnector.prototype.create = function create(Model, values, callback) {
	var instance = Model.instance(values);
	instance.setPrimaryKey(values.id || ++PK);
	this.getTable(Model.name).push(instance);
	callback && callback(null, instance);
};

MemoryConnector.prototype.save = function save(Model, instance, callback) {
	var table = this.getTable(Model.name);
	for (var c = 0; c < table.length; c++) {
		var entry = table[c];
		if (entry.getPrimaryKey() === instance.getPrimaryKey()) {
			var obj = instance.toJSON();
			for (var k in obj) {
				entry.set(k, obj[k], true);
			}
			break;
		}
	}
	callback && callback(null, instance);
};

function iterator(DB, instance, fn) {
	var results = [],
		pk = instance && ((typeof(instance) === 'object' && instance instanceof Instance) ? instance.getPrimaryKey() : instance),
		pkStr = String(pk);
	for (var c = 0; c < DB.length; c++) {
		var object = DB[c];
		if (!pk || String(object.getPrimaryKey()) === pkStr) {
			if (fn) {
				if (fn(c, object)) {
					results.push(object);
				}
			}
			else {
				results.push(object);
			}
			if (pk) {
				// if we have a primary key, then bail after we find one
				break;
			}
		}
	}
	return results;
}

MemoryConnector.prototype.delete = function remove(Model, instance, callback) {
	var table = this.getTable(Model.name),
		keys = [],
		found = iterator(table, instance, function iterate(index, object) {
			if (instance.getPrimaryKey() === object.getPrimaryKey()) {
				keys.push(index);
				return true;
			}
		}.bind(this));
	keys.forEach(function (index) {
		table.splice(index, 1);
	});
	callback && callback(null, found && found[0]);
};

MemoryConnector.prototype.deleteAll = function deleteAll(Model, callback) {
	var table = this.getTable(Model.name),
		count = table.length;
	this.DB[Model.name] = [];
	callback && callback(null, count);
};

MemoryConnector.prototype.count = function find(Model, options, callback) {
	var where = Model.translateKeysForPayload(options.where) || {},
		cursor = Mingo.find(this.getTable(Model.name), where);

	callback(null, cursor.count());
};

MemoryConnector.prototype.query = function find(Model, options, callback) {
	if (options.where && !_.isObject(options.where)) {
		throw new Error('query "where" parameter must be an object; got: ' + options.where);
	}
	var where = Model.translateKeysForPayload(options.where),
		cursor = Mingo.find(this.getTable(Model.name), where),
		sort = options.sort,
		skip = options.skip,
		limit = options.limit,
		sel = Model.translateKeysForPayload(options.sel),
		unsel = Model.translateKeysForPayload(options.unsel);

	if (sort) {
		cursor.sort(sort);
	}
	if (skip) {
		cursor.skip(skip);
	}
	cursor.limit(limit);

	var records = cursor.all();

	// filter out fields
	if (sel || unsel) {
		sel = sel && fieldsToArray(options.sel);
		unsel = unsel && fieldsToArray(options.unsel);
		records = records.map(function (record) {
			var id = record.getPrimaryKey(),
				rec = record.toJSON();
			if (sel && sel.length) {
				rec = _.pick(rec, sel);
			}
			if (unsel && unsel.length) {
				rec = _.omit(rec, unsel);
			}
			var instance = Model.instance(rec, true);
			instance.setPrimaryKey(id);
			return instance;
		});
	}

	var collection = new Collection(Model, records);
	callback(null, collection);
};

MemoryConnector.prototype.findAll = function findAll(Model, callback) {
	callback(null, new Collection(Model, this.getTable(Model.name)));
};

MemoryConnector.prototype.findByID = function findByID(Model, id, callback) {
	var found = iterator(this.getTable(Model.name), id);
	callback(null, found && found[0]);
};

function fieldsToArray(fields) {
	if (_.isString(fields)) {
		return fields.split(',').map(function (f) {
			return f.trim();
		});
	}
	else if (!Array.isArray(fields) && _.isObject(fields)) {
		return Object.keys(fields);
	}
	else if (Array.isArray(fields)) {
		return fields;
	}
	throw new Error("invalid sel field type");
}
