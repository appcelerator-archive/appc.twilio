var Arrow = require('arrow');

module.exports = Arrow.createModel('queue', {
    fields: {
        sid: { type: String },
        friendlyName: { type: String },
        current_size: { type: Number },
        average_wait_time: { type: Number },
        max_size: { type: Number },
        date_created: { type: String },
        date_updated: { type: String },
        uri: { type: String }
    },
    connector: 'appc.twilio'
});
