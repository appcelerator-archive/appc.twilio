module.exports = {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this account.' },
    ownerAccountSid: { type: String, description: 'The Sid of the parent account for this account. The OwnerAccountSid of a parent account is its own sid.' },
    friendlyName: { type: String, required: true, description: 'A human readable description of this account, up to 64 characters long' },
    status: { type: String, description: 'The status of this account. Usually active, but can be suspended or closed.' },
    dateCreated: { type: String, description: 'The date that this account was created' },
    dateUpdated: { type: String, description: 'The date that this account was last updated' },
    authToken: { type: String, description: 'The authorization token for this account. This token should be kept a secret, so no sharing.' },
    type: { type: String, description: 'The type of this account. Either Trial or Full if you have upgraded' },
    uri: { type: String, description: 'The URI for this resource' },
    subresourceUris: { type: Object, description: 'The list of subresources under this account.' }
  },
  actions: ['create', 'read']
}

