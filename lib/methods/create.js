// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
exports.create = function (Model, values, callback) {
	var instance = Model.instance(values, false), // ... "instance" is an instance of the Model...
		payload = instance.toPayload(); // ... and "payload" is the translated raw values, based on field names.

	// TODO: Create the instance in your backing data store.
	yourDataStore.create(payload, function (err, result) {
		// If an error is hit:
		if (err) {
			return callback(err);
		}

		// If nothing was created by this request:
		if (!result) {
			return callback();
		}

		// TODO: Otherwise, if all went well:
		var instance = Model.instance(result, true);
		instance.setPrimaryKey(String(result._id)); // Note: the primary key can be a number, too.
		callback(null, instance);
	});
};
