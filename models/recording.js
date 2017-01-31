var Arrow = require('arrow');

module.exports = Arrow.createModel('recording', {
    fields: {
        "first_page_uri": { type: String },
        "end": { type: Number },
        "previous_page_uri": { type: String },
        "uri": { type: String },
        "page_size": { type: String },
        "start": { type: Number },
        "recordings": { type: Array },
        "next_page_uri": { type: String },
        "page": { type: Number }
    },
    connector: "appc.twilio",
    actions: ["read"]
});