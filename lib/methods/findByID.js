const Arrow = require('arrow');
/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
	const connector = this;
	const number = connector.config.twilio_number;
	const twilioAPI = connector.twilioAPI;

	// Find the instance with the provided call sid
	twilioAPI.find.byId(Model, id, (error, data) => {
		callback(error, data);
	});
};
