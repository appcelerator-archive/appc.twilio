var Arrow = require('arrow');

module.exports = Arrow.createModel('sandbox', {
    fields: {
        pin: { type: String },
        account_sid: { type: String },
        phone_number: { type: String },
        application_sid: { type: String },
        voice_url: { type: String },
        voice_method: { type: String },
        sms_url: { type: String },
        sms_method: { type: String },
        status_callback: { type: String },
        status_callback_method: { type: String },
        date_created: { type: String },
        date_updated: { type: String },
        api_version: { type: String },
        uri: { type: String }
    },
    connector: 'appc.twilio',
    actions: ['read']
});
