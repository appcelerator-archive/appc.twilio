var Arrow = require('arrow');

module.exports = Arrow.createModel('queues', {
    fields: {
        first_page_uri: { type: String },
        end: { type: Number },
        previous_page_uri: { type: String },
        queues: { type: Array },
        uri: { type: String },
        page_size: { type: Number },
        start: { type: Number },
        next_page_uri: { type: String },
        page: { type: Number }
    },
    connector: "appc.twilio"
});