var Arrow = require('arrow')

module.exports = Arrow.createModel('call', {
  fields: {
    sid: { type: String },
    dateCreated: { type: String },
    parentCallSid: { type: String },
    to: { type: String, required: true },
    from: { type: String },
    fromFormatted: { type: String },
    phoneNumberSid: { type: String },
    status: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    duration: { type: String },
    price: { type: String },
    priceUnit: { type: String },
    direction: { type: String },
    answeredBy: { type: String },
    annotation: { type: String },
    apiVersion: { type: String },
    forwardedFrom: { type: String },
    groupSid: { type: String },
    callerName: { type: String },
    uri: { type: String },
    subresourceUris: { type: Object }
  },
  connector: 'appc.twilio',
  actions: ['create', 'read', 'delete']
})
