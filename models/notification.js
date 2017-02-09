var Arrow = require('arrow');

module.exports = Arrow.createModel('notification', {
    fields: {
        first_page_uri: { type: String },
        end: { type: Number },
        previous_page_uri: { type: String },
        uri: { type: String },
        page_size: { type: Number },
        page: { type: Number },
        notifications: { type: Array },
        next_page_uri: { type: String },
        start: { type: Number }
    },
    connector: 'appc.twilio',
    actions: ['read']
});
