var Arrow = require('arrow');

module.exports = Arrow.createModel('incomingPhoneNumber', {
    fields: {
        sid: { type: String },
        account_sid: { type: String },
        friendly_name: { type: String },
        phone_number: { type: String },
        voice_url: { type: String },
        voice_method: { type: String },
        voice_fallback_url: { type: String },
        voice_fallback_method: { type: String },
        voice_application_sid: { type: String },
        date_created: { type: String },
        date_updated: { type: String },
        sms_url: { type: String },
        sms_method: { type: String },
        sms_fallback_url: { type: String },
        sms_fallback_method: { type: String },
        sms_application_sid: { type: String },
        capabilities: {
            voice: { type: Boolean },
            sms: { type: Boolean },
            mms: { type: Boolean },
        },
        beta: { type: Boolean },
        status_callback: { type: String },
        status_callback_method: { type: String },
        api_version: { type: String },
        uri: { type: String }
    },
    connector: "appc.twilio"
});
