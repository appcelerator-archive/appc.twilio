var Arrow = require('arrow')

module.exports = Arrow.createModel('outgoingCallerId', {
  fields: {
    sid: { type: String },
    accountSid: { type: String },
    friendlyName: { type: String },
    phoneNumber: { type: String },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    uri: { type: String }
  },
  connector: 'appc.twilio',
  actions: ['read', 'create', 'update', 'delete']
})
