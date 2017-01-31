var Arrow = require('arrow');

module.exports = Arrow.createModel('conference', {
    fields: {
        api_version: { type: String },
        date_updated: { type: String },
        date_created: { type: String },
        friendly_name: { type: String },
        sid: { type: String },
        status: { type: String },
        subresource_uris: {
            participants: { type: String }
        },
        uri: { type: String }
    },
    connector: "appc.twilio"
});
