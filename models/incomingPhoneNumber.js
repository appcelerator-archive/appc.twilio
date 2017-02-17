var Arrow = require('arrow')

module.exports = Arrow.createModel('incomingPhoneNumber', {
  fields: {
    sid: { type: String },
    accountSid: { type: String },
    friendlyName: { type: String },
    phoneNumber: { type: String },
    voiceUrl: { type: String },
    voiceMethod: { type: String },
    voiceFallbackUrl: { type: String },
    voiceFallbackMethod: { type: String },
    voiceApplicationSid: { type: String },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    smsUrl: { type: String },
    smsMethod: { type: String },
    smsFallbackUrl: { type: String },
    smsFallbackMethod: { type: String },
    smsApplicationSid: { type: String },
    capabilities: { type: Object },
    beta: { type: Boolean },
    statusCallback: { type: String },
    statusCallbackMethod: { type: String },
    apiVersion: { type: String },
    uri: { type: String }
  },
  connector: 'appc.twilio'
})
