/**
 * Updates a model or creates the model if it cannot be found.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to update.
 * @param {Object} doc Model attributes to set.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated or new model.
 */
exports.upsert = function upsert(Model, id, doc, callback) {
	const connector = this;
	const number = connector.config.twilio_number;
	const twilioAPI = connector.twilioAPI;

	switch (Model.name) {
		case 'address':
			twilioAPI.updateAddress(Model, id, doc, (error, data) => {
				callback(error, data);
			});
		default:
			break;
	}
};

function updateAddress(Model, id, doc, callback) {
	client.addresses(id).post(
		doc, function (err, address) {
			if (err) {
				callback(new Error('Could not update this model'));
			}
			if (!err) {
				var instance = Model.instance(address, true);
				callback(null, []);
			}
		});
}
