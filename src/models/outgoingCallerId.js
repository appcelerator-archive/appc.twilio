module.exports = {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    accountSid: { type: String, description: 'The unique id of the Account responsible for this Caller Id.' },
    friendlyName: { type: String, description: 'A human readable descriptive text for this resource, up to 64 characters long. By default, the FriendlyName is a nicely formatted version of the phone number.' },
    phoneNumber: { type: String, description: 'The incoming phone number. Formatted with a \'+\' and country code e.g., +16175551212 (E.164 format).' },
    dateCreated: { type: String, description: 'The date that this resource was created, given in RFC 2822 format.' },
    dateUpdated: { type: String, description: 'The date that this resource was last updated, given in RFC 2822 format.' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com.' }
  },
  actions: ['read', 'update', 'delete'],
  disabledActions: ['distinct', 'count', 'query'],
  metadata: {
    primaryKey: 'sid'
  }
}
