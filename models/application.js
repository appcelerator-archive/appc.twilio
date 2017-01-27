var Arrow = require('arrow');

module.exports = Arrow.Model.extend('application', {
    fields: {
        sid: { type: String },
        date_created: { type: String },
        date_updated: { type: String },
        account_sid: { type: String, },
        friendly_name: { type: String },
        api_version: { type: String },
        voice_url: { type: String },
        voice_method: { type: String },
        voice_fallback_url: { type: String },
        voice_fallback_method: { type: Object },
        status_callback: { type: String },
        status_callback_method: { type: String },
        voice_caller_id_lookup: { type: String },
        sms_url: { type: String, },
        sms_method: { type: String },
        sms_fallback_url: { type: String },
        sms_fallback_method: { type: String },
        sms_status_callback: { type: String },
        uri: { type: String }
    },
    connector: "appc.twilio"
});
