// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Deletes the model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted model.
 */
exports['delete'] = function (Model, instanceID, callback) {

	client.messages(instanceID).post({
		body: ""
	}, function(err, message) {
		// will be an empty string
		process.stdout.write(message.body);
	});

};
