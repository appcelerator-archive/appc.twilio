module.exports = {
  fields: {
    accountSid: { type: String, description: 'The unique id of the Account responsible for this recording.' },
    apiVersion: { type: String, description: 'The version of the API in use during the recording.' },
    callSid: { type: String, description: 'A unique identifier for the call associated with the recording. This will always refer to the parent leg of a two leg call.' },
    channels: { type: Number, description: 'The number of channels in the final recording file as an integer. Possible values are 1, 2. Separating a two leg call into two separate channels of the recording file is supported in Dial and Outbound Rest API record options.' },
    dateCreated: { type: String, description: 'The date that this resource was created, given in RFC 2822 format.' },
    dateUpdated: { type: String, description: 'The date that this resource was last updated, given in RFC 2822 format.' },
    duration: { type: String, description: 'The length of the recording, in seconds.' },
    price: { type: String, description: 'The one-time cost of creating this recording. Example: -0.00250' },
    priceUnit: { type: String, description: 'The currency used in the Price property. Example: USD' },
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    source: { type: String, description: 'The status of the recording. Possible values are processing, completed.' },
    status: { type: String, description: 'The type of call that created this recording. Possible values are RecordVerb, DialVerb, Conference, OutboundAPI, Trunking.' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com' }
  },
  actions: ['read']
}

