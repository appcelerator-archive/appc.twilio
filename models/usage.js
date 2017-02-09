var Arrow = require('arrow');

module.exports = Arrow.createModel('usage', {
    fields: {
        subresource_uris: {
            records: { type: String },
            triggers: { type: String }
        }
    },
    connector: 'appc.twilio',
    actions: ['read']
});
