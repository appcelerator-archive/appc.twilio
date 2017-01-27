/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
exports.create = function (Model, values, callback) {
	const number = this.config.twilio_number;
	switch (Model.name) {
		case 'call':
			makeCall(Model, values, number, (error, data) => {
				callback(error, data);
			});
		case 'sms':
		default:
			break;
	}
};

function makeCall(Model, values, number, callback) {
	client.makeCall({
		to: values.to, // Any number Twilio can call
		from: number, // A number you bought from Twilio and can use for outbound communication
		url: 'https://demo.twilio.com/welcome/voice' // A URL that produces an XML document (TwiML) which contains instructions for the call

	}, (err, result) => {
		if(err) {
			callback(new Error('Could not make this call!'));
		}
		if(!err) {
			var instance = Model.instance(result, true);
			callback(null, instance);
		}
	});
}
