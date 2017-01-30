// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{},
	Arrow = require('arrow');

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll(Model, callback) {
	// TODO: Find all results for this Model from your data store. Arrow defaults to a limit of 1000 results.
	yourDataStore.findAll(Model.name, function (err, results) {
		if (err) {
			return callback(err);
		}

		// TODO: Instantiate each result.
		var array = [];
		for (var c = 0; c < results.length; c++) {
			var instance = Model.instance(results[c], true);
			instance.setPrimaryKey(String(results[c].id));
			array.push(instance);
		}

		// Turn the array of instances in to a collection, and return it.
		callback(null, new Arrow.Collection(Model, array));

	});
};