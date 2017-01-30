// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
exports.create = function create(Model, values, callback) {
	var client = Model.connector.twilio;

	client.messages.create({
		to: values.to,
		from: values.from,
		body: values.body,
	}, function (err, message) {
		console.log(err);
	});
	
	callback(null, "created");
	
};
