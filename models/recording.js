var Arrow = require('arrow')

module.exports = Arrow.createModel('recording', {
  fields: {
    accountSid: { type: String },
    apiVersion: { type: String },
    callSid: { type: String },
    channels: { type: Number },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    duration: { type: String },
    price: { type: String },
    priceUnit: { type: String },
    sid: { type: String },
    source: { type: String },
    status: { type: String },
    uri: { type: String }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
