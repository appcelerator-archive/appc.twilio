var Arrow = require('arrow');

module.exports = Arrow.Model.extend('call', {
	fields: {
		sid: { type: String },
		date_created: { type: String },
		parent_call_sid: { type: String },
		to: { type: String },
		from: { type: String },
		from_formatted: { type: String },
		phone_number_sid: { type: String },
		status: { type: String },
		start_time: { type: String },
		end_time: { type: String },
		duration: { type: String },
		price: { type: String },
		price_unit: { type: String },
		direction: { type: String },
		answered_by: { type: String },
		annotation: { type: String },
		api_version: { type: String },
		forwarded_from: { type: String },
		group_sid: { type: String },
		caller_name: { type: String },
		uri: { type: String },
		subresource_uris: { type: Object }
	},
	connector: "appc.twilio"
});