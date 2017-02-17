var Arrow = require('arrow')

module.exports = Arrow.createModel('message', {
  fields: {
    sid: { type: String },
    date_created: { type: String },
    date_updated: { type: String },
    date_sent: { type: String },
    account_sid: { type: String },
    to: { type: String },
    from: { type: String },
    messaging_service_sid: { type: String },
    body: { type: String },
    status: { type: String },
    num_segments: { type: String },
    num_media: { type: String },
    direction: { type: String },
    api_version: { type: String },
    price: { type: String },
    price_unit: { type: String },
    error_code: { type: String },
    error_message: { type: String },
    uri: { type: String },
    subresource_uris: { type: Object }
  },
  connector: 'appc.twilio',
  actions: ['create', 'read', 'delete']
})
