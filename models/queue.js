var Arrow = require('arrow')

module.exports = Arrow.createModel('queue', {
  fields: {
    sid: { type: String },
    friendlyName: { type: String },
    currentSize: { type: Number },
    averageWaitTime: { type: Number },
    maxSize: { type: Number },
    dateCreated: { type: String },
    dateUpdated: { type: String },
    uri: { type: String }
  },
  connector: 'appc.twilio'
})
