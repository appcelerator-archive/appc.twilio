var Arrow = require('arrow')

module.exports = Arrow.createModel('usage', {
  fields: {
    subresource_uris: { type: Object }
  },
  connector: 'appc.twilio',
  actions: ['read']
})
