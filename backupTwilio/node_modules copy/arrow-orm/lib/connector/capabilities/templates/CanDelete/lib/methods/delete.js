// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Deletes the model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted model.
 */
exports['delete'] = function (Model, instance, callback) {
	// TODO: Delete the model, usually based on instance.getPrimaryKey().
	yourDataStore.deleteByID(instance.getPrimaryKey(), function (err, result) {
		if (err) {
			return callback(err);
		}

		// TODO: If nothing was deleted by this request:
		if (!result) {
			return callback();
		}

		// TODO: Otherwise, if all went well:
		callback(null, instance);
	});
};
