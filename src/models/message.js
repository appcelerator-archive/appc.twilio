module.exports = {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    dateCreated: { type: String, description: 'The date that this resource was created, given in RFC 2822 format.' },
    dateUpdated: { type: String, description: 'The date that this resource was last updated, given in RFC 2822 format.' },
    dateSent: { type: String, description: 'The date that the message was sent. For outgoing messages, this is the date that the message was sent from Twilio\'s platform.' },
    accountSid: { type: String, description: 'The unique id of the Account that sent this message.' },
    to: { type: String, required: true, description: 'The phone number that received the message in E.164 format.' },
    from: { type: String, description: 'The phone number (in E.164 format) or alphanumeric sender ID that initiated the message. ' },
    messagingServiceSid: { type: String, description: 'The unique id of the Messaging Service used with the message. ' },
    body: { type: String, required: true, description: 'The text body of the message. Up to 1600 characters long.' },
    status: { type: String, description: 'The status of this message. Either accepted, queued, sending, sent,failed, delivered, undelivered, receiving or received. ' },
    numSegments: { type: String, description: 'This property indicates the number of segments that make up the message. If your body is too large to be sent as a single SMS message, it will be segmented and charged accordingly. ' },
    numMedia: { type: String, description: 'This property indicates the number of media files associated with the message. ' },
    direction: { type: String, description: 'The direction of this message. inbound for incoming messages, outbound-api for messages initiated via the REST API, outbound-call for messages initiated during a call or outbound-reply for messages initiated in response to an incoming message' },
    apiVersion: { type: String, description: 'The version of the Twilio API used to process the message.' },
    price: { type: String, description: 'The amount billed for the message, in the currency associated with the account. Note that your account will be charged for each segment sent to the handset.' },
    priceUnit: { type: String, description: 'The currency in which Price is measured, in ISO 4127 format (e.g. usd, eur, jpy).' },
    errorCode: { type: String, description: 'The error code, if any, associated with your message. If your message status is failed or undelivered, the ErrorCode can give you more information about the failure.' },
    errorMessage: { type: String, description: 'The human readable description of the ErrorCode above. If the message status is failed or undelivered it will have one of the values described below, otherwise it will be null.' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com' },
    subresourceUris: { type: Object, description: 'The URIs for any subresources associate with this resource, relative to https://api.twilio.com' }
  },
  actions: ['create', 'read', 'delete'],
  disabledActions: ['distinct', 'count'],
  metadata: {
    primaryKey: 'sid'
  }
}
