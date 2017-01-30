var Arrow = require('arrow');

module.exports = Arrow.createModel('sms_messages', {
    fields: {
        sid: { type: String },
        date_created: { type: String },
        date_updated: { type: String },
        date_sent: { type: String },
        account_sid: { type: String },
        to: { type: String },
        from: { type: String },
        body: { type: String },
        status: { type: String },
        direction: { type: String },
        price: { type: String },
        price_unit: { type: String },
        api_version: { type: String },
        uri: { type: String },
        num_segments: { type: String }
    },
    connector: "appc.twilio"
});