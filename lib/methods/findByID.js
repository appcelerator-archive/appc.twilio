/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
	// Find the instance with the provided call sid.
	switch (Model.name) {
		case 'call':
			getCallById(Model, id, (error, data) => {
				callback(error, data);
			});
		case 'sms':
		default:
			break;
	}
};

function getCallById(Model, id, callback) {
	if (!id) {
		callback(new Error('Missing required "id"'));
	}
	client.calls(id).get(function (err, call) {
		if (err) {
			callback(new Error('Could not find call with this Id'));
		}
		if (!err) {
			var instance = Model.instance(call, true);
			callback(null, instance);
		}
	});
}
