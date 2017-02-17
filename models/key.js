var Arrow = require('arrow')

module.exports = Arrow.createModel('key', {
  fields: {
    dateUpdated: { type: String },
    dateCreated: { type: String },
    friendlyName: { type: String },
    sid: { type: String }
  },
  connector: 'appc.twilio'
})
