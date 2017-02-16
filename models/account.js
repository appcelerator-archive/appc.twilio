var Arrow = require('arrow')

module.exports = Arrow.createModel('account', {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this account.' },
    owner_account_sid: { type: String, description: 'The Sid of the parent account for this account. The OwnerAccountSid of a parent account is its own sid.' },
    friendly_name: { type: String, description: 'A human readable description of this account, up to 64 characters long' },
    status: { type: String, description: 'The status of this account. Usually active, but can be suspended or closed.' },
    date_created: { type: String, description: 'The date that this account was created' },
    date_updated: { type: String, description: 'The date that this account was last updated' },
    auth_token: { type: String, description: 'The authorization token for this account. This token should be kept a secret, so no sharing.' },
    type: { type: String, description: 'The type of this account. Either Trial or Full if you have upgraded' },
    uri: { type: String, description: 'The URI for this resource' },
    subresource_uris: { type: Object, description: 'The list of subresources under this account.' }
  },
  connector: 'appc.twilio'
})
