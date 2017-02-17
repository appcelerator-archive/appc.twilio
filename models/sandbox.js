var Arrow = require('arrow')

module.exports = Arrow.createModel('sandbox', {
  fields: {
    pin: { type: String },
    accountSid: { type: String },
    phoneNumber: { type: String },
    applicationSid: { type: String },
    voiceUrl: { type: String },
    voiceMethod: { type: String },
    smsUrl: { type: String },
    smsMethod: { type: String },
    statusCallback: { type: String },
    statusCallbackMethod: { type: String },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    apiVersion: { type: String },
    uri: { type: String }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
