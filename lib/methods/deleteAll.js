// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Deletes all the data records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted models.
 */
exports.deleteAll = function (Model, callback) {
	// TODO: Delete every result from the data store for this model.
	yourDataStore.deleteAll(Model.name, function (err, count) {
		if (err) {
			return callback(err);
		}

		// TODO: If all went well:
		callback(null, count || 0);
	});
};