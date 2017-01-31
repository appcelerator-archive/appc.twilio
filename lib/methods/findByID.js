const Arrow = require('arrow'),
	pluralize = require('pluralize');
/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
	const key = pluralize(Model.name);

	// Find the instance with the provided call sid
	if (!id) {
		callback(new Error('Missing required parameter "id"'));
	}
	client[key](id).get(function (err, call) {
		if (err) {
			callback(new Error(`Could not find ${Model.name} with ID: ${id}`));
		}
		if (!err) {
			var instance = Model.instance(call, true);
			callback(null, instance);
		}
	});
};
