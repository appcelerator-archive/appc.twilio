var Arrow = require('arrow')

module.exports = Arrow.createModel('transcription', {
  fields: {
    accountSid: { type: String },
    apiVersion: { type: String },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    duration: { type: String },
    price: { type: String },
    recordingSid: { type: String },
    sid: { type: String },
    status: { type: String },
    transcriptionText: { type: String },
    type: { type: String },
    url: { type: String }
  },
  connector: 'appc.twilio',
  actions: ['read', 'delete']
})
