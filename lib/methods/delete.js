/**
 * Deletes the model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted model.
 */
exports['delete'] = function (Model, instance, callback) {
	const connector = this;
	const twilioAPI = connector.twilioAPI;

	twilioAPI.deleteById(Model, instance.sid, (error, data) => {
		callback (error, data);
	})

};
