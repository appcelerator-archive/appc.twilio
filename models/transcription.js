var Arrow = require('arrow');

module.exports = Arrow.createModel('transcription', {
	fields: {
		account_sid: { type: String },
		api_version: { type: String },
		date_created: { type: String },
		date_updated: { type: String },
		duration: { type: String },
		price: { type: String },
		recording_sid: { type: String },
		sid: { type: String },
		status: { type: String },
		transcription_text: { type: String },
		type: { type: String },
		url: { type: String }
	},
	connector: 'appc.twilio',
	actions: ['read', 'delete']
});
