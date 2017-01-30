// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Updates a Model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance to update.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated model.
 */
exports.save = function (Model, instance, callback) {
	var payload = instance.toPayload(); // "payload" is the translated raw values, based on field names.

	// TODO: Update the instance in your backing data store.
	yourDataStore.update(instance.getPrimaryKey(), payload, function (err, result) {
		if (err) {
			return callback(err);
		}

		// TODO: If nothing was updated by this request:
		if (!result) {
			return callback();
		}

		// TODO: Otherwise, if all went well:
		callback(null, instance);
	});
};
