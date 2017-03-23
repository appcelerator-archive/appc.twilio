module.exports = {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    dateCreated: { type: String, description: 'The date that this resource was created, given as GMT in RFC 2822 format.' },
    parentCallSid: { type: String, description: 'A 34 character string that uniquely identifies the call that created this leg.' },
    to: { type: String, required: true, description: 'The phone number, SIP address or Client identifier that received this call. Phone numbers are in E.164 format (e.g. +16175551212). SIP addresses are formated as name@company.com. Client identifiers are formatted client:name.' },
    from: { type: String, description: 'The phone number, SIP address or Client identifier that made this call. Phone numbers are in E.164 format (e.g. +16175551212). SIP addresses are formated as name@company.com. Client identifiers are formatted client:name.' },
    fromFormatted: { type: String, description: 'The formatted phone number, Sip, address or Client that made this call' },
    phoneNumberSid: { type: String, description: 'If the call was inbound, this is the Sid of the IncomingPhoneNumber that received the call. If the call was outbound, it is the Sid of the OutgoingCallerId from which the call was placed.' },
    status: { type: String, description: 'A string representing the status of the call. May be queued, ringing, in-progress, canceled, completed, failed, busy or no-answer. ' },
    startTime: { type: String, description: 'The start time of the call, given as GMT in RFC 2822 format. Empty if the call has not yet been dialed.' },
    endTime: { type: String, description: 'The end time of the call, given as GMT in RFC 2822 format. Empty if the call has not yet been completed.' },
    duration: { type: String, description: 'The length of the call in seconds. This value is empty for busy, failed, unanswered or ongoing calls.' },
    price: { type: String, description: 'The charge for this call, in the currency associated with the account. Populated after the call is completed. May not be immediately available.' },
    priceUnit: { type: String, description: 'The currency in which Price is measured, in ISO 4127 format (e.g. USD, EUR, JPY). Always capitalized for calls.' },
    direction: { type: String, description: 'A string describing the direction of the call. inbound for inbound calls, outbound-api for calls initiated via the REST API or outbound-dial for calls initiated by a <Dial> verb. ' },
    answeredBy: { type: String, description: 'If this call was initiated with answering machine detection, either human or machine. Empty otherwise.' },
    annotation: { type: String, description: 'An annotation is a metadatum (e.g. a comment, explanation, presentational markup)' },
    apiVersion: { type: String, description: 'Version of the Twilio API' },
    forwardedFrom: { type: String, description: 'If this call was an incoming call forwarded from another number, the forwarding phone number (depends on carrier supporting forwarding). Empty otherwise.' },
    groupSid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    callerName: { type: String, description: 'If this call was an incoming call to a phone number with Caller ID Lookup enabled, the caller\'s name. Empty otherwise.' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com' },
    subresourceUris: { type: Object, description: 'The subresource URI for this resource' }
  },
  actions: ['create', 'read', 'delete'],
  metadata: {
    primaryKey: 'sid'
  }
}

