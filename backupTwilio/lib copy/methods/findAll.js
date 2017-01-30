// TODO: Reference the module to connect to your data store.
var Arrow = require('arrow');
//const client = require('./../client');

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll(Model, callback) {
	var client = Model.connector.twilio;

	client.messages.list((err, data) => {
		callback(null, data.messages);	
	});
};
