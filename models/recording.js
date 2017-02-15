var Arrow = require('arrow')

module.exports = Arrow.createModel('recording', {
  fields: {
    account_sid: { type: String },
    api_version: { type: String },
    call_sid: { type: String },
    channels: { type: Number },
    date_created: { type: String },
    date_updated: { type: String },
    duration: { type: String },
    price: { type: String },
    price_unit: { type: String },
    sid: { type: String },
    source: { type: String },
    status: { type: String },
    uri: { type: String }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
