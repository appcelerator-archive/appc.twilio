var Arrow = require('arrow')

module.exports = Arrow.createModel('sip', {
  fields: {
    uri: { type: String },
    subresource_uris: {
      domains: { type: String },
      ip_access_control_lists: { type: String },
      credential_lists: { type: String }
    }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
