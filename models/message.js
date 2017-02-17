var Arrow = require('arrow')

module.exports = Arrow.createModel('message', {
  fields: {
    sid: { type: String },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    dateSent: { type: String },
    accountSid: { type: String },
    to: { type: String },
    from: { type: String },
    messagingServiceSid: { type: String },
    body: { type: String },
    status: { type: String },
    numSegments: { type: String },
    numMedia: { type: String },
    direction: { type: String },
    apiVersion: { type: String },
    price: { type: String },
    priceUnit: { type: String },
    errorCode: { type: String },
    errorMessage: { type: String },
    uri: { type: String },
    subresourceUris: { type: Object }
  },
  connector: 'appc.twilio',
  actions: ['create', 'read', 'delete']
})
