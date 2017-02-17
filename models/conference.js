var Arrow = require('arrow')

module.exports = Arrow.createModel('conference', {
  fields: {
    apiVersion: { type: String },
    dateUpdated: { type: String },
    dateCreated: { type: String },
    friendlyName: { type: String },
    sid: { type: String },
    status: { type: String },
    subresourceUris: { type: Object },
    uri: { type: String }
  },
  connector: 'appc.twilio'
})
