var Arrow = require('arrow')

module.exports = Arrow.createModel('sip', {
  fields: {
    uri: { type: String },
    subresourceUris: { type: Object }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
