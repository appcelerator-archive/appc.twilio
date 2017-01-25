// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
	// TODO: Find the instance with the provided id.
	yourDataStore.findByID(id, function (err, result) {
		if (err) {
			return callback(err);
		}

		// TODO: If nothing was found by this request:
		if (!result) {
			return callback();
		}

		// TODO: Otherwise, if all went well:
		var instance = Model.instance(result, true);
		instance.setPrimaryKey(String(result.id)); // Note: the primary key can be a number, too.
		callback(null, instance);
	});
};
