var Arrow = require('arrow')

module.exports = Arrow.createModel('key', {
  fields: {
    date_updated: { type: String },
    date_created: { type: String },
    friendly_name: { type: String },
    sid: { type: String }
  },
  connector: 'appc.twilio'
})
