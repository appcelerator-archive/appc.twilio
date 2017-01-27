var Arrow = require('arrow');

module.exports = Arrow.createModel('outgoing_caller_ids', {
    fields: {
        "first_page_uri": { type: String },
        "end": { type: Number },
        "previous_page_uri": { type: String },
        "outgoing_caller_ids": [
            {
                "sid": { type: String },
                "account_sid": { type: String },
                "friendly_name": { type: String },
                "phone_number": { type: String },
                "date_created": { type: String },
                "date_updated": { type: String },
                "uri": { type: String }
            }
        ],
        "uri": { type: String },
        "page_size": { type: Number },
        "start": { type: Number },
        "next_page_uri": { type: String },
        "page": { type: Number }
    },
    connector: "appc.twilio"
});