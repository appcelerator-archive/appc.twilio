// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{},
	_ = require('lodash');

/**
 * Finds one model instance and modifies it.
 * @param {Arrow.Model} Model
 * @param {ArrowQueryOptions} options Query options.
 * @param {Object} doc Attributes to modify.
 * @param {Object} [args] Optional parameters.
 * @param {Boolean} [args.new=false] Set to `true` to return the new model instead of the original model.
 * @param {Boolean} [args.upsert=false] Set to `true` to allow the method to create a new model.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the modified model.
 * @throws {Error} Failed to parse query options.
 */
exports.findAndModify = function findAndModify(Model, options, doc, args, callback) {
	if (typeof args === "function") {
		callback = args;
		args = {};
	}

	// TODO: Translate the Arrow style query fields below to line up with your data store.
	var where = _.pick(Model.translateKeysForPayload(options.where), Model.payloadKeys().concat(['id'])),
		order = Model.translateKeysForPayload(options.order);

	// TODO: Find and modify the instance in your backing data store.
	yourDataStore.findAndModify(where, order, doc, args, function (err, result) {
		if (err) {
			return callback(err);
		}

		// TODO: If nothing was found by this request:
		if (!result || Object.keys(result).length === 0) {
			return callback(null, result);
		}

		// TODO: Otherwise, if all went well:
		var instance = Model.instance(result, true);
		instance.setPrimaryKey(String(result.id)); // Note: the primary key can be a number, too.
		callback(null, instance);
	});
};
