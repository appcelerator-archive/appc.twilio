var Arrow = require('arrow');

module.exports = Arrow.createModel('account', {
	fields: {
		sid: { type: String },
		owner_account_sid: { type: String },
		friendly_name: { type: String },
		status: { type: String },
		date_created: { type: String },
		date_updated: { type: String },
		auth_token: { type: String },
		type: { type: String },
		uri: { type: String },
		subresource_uris: { type: Object },
	},
	connector: "appc.twilio"
});
