var Arrow = require('arrow');

module.exports = Arrow.createModel('outgoingCallerId', {
	fields: {
		sid: { type: String },
		account_sid: { type: String },
		friendly_name: { type: String },
		phone_number: { type: String },
		date_created: { type: String },
		date_updated: { type: String },
		uri: { type: String }
	},
	connector: 'appc.twilio',
	actions: ['read', 'create', 'update', 'delete']
});
