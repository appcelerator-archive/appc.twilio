var Arrow = require('arrow');

module.exports = Arrow.createModel('availablePhoneNumber', {
	fields: {
		friendly_name: { type: String },
		phone_number: { type: String },
		lata: { type: String },
		rate_center: { type: String },
		latitude: { type: String },
		longitude: { type: String },
		region: { type: String },
		postal_code: { type: String },
		iso_country: { type: String },
		capabilities: {
			voice: { type: Boolean },
			SMS: { type: Boolean },
			MMS: { type: Boolean }
		},
		beta: { type: Boolean }
	},
	connector: "appc.twilio"
});
