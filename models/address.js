var Arrow = require('arrow');

module.exports = Arrow.Model.extend('address', {
	fields: {
        sid: { type: String },
		friendly_name: { type: String },
		customer_name: { type: String },
		street: { type: String },
		city: { type: String },
		region: { type: String },
		postal_code: { type: String },
		iso_country: { type: String }
	},
    connector: "appc.twilio"
});