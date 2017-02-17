var Arrow = require('arrow')

module.exports = Arrow.createModel('application', {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    dateCreated: { type: String, description: 'The date that this resource was created' },
    dateUpdated: { type: String, description: 'The date that this resource was last updated' },
    accountSid: { type: String, description: 'The unique id of the Account that created this application.' },
    friendlyName: { type: String, description: 'A human readable descriptive text for this resource, up to 64 characters long.' },
    apiVersion: { type: String, description: 'Requests to this application will start a new TwiML session with this API version' },
    voiceUrl: { type: String, description: 'The URL Twilio will request when a phone number assigned to this application receives a call.' },
    voiceMethod: { type: String, description: 'The HTTP method Twilio will use when requesting the above Url. ' },
    voiceFallbackUrl: { type: String, description: 'The URL that Twilio will request if an error occurs retrieving or executing the TwiML requested by Url.' },
    voiceFallbackMethod: { type: Object, description: 'The HTTP method Twilio will use when requesting the VoiceFallbackUrl. Either GET or POST.' },
    statusCallback: { type: String, description: 'The URL that Twilio will request to pass status parameters (such as call ended) to your application.' },
    statusCallbackMethod: { type: String, description: 'The HTTP method Twilio will use to make requests to the StatusCallback URL. Either GET or POST.' },
    voiceCallerIdLookup: { type: String, description: 'Look up the caller\'s caller-ID name from the CNAM database (additional charges apply). Either true or false.' },
    smsUrl: { type: String, description: 'The URL Twilio will request when a phone number assigned to this application receives an incoming SMS message.' },
    smsMethod: { type: String, description: 'The HTTP method Twilio will use when making requests to the SmsUrl. Either GET or POST.' },
    smsFallbackUrl: { type: String, description: 'The URL that Twilio will request if an error occurs retrieving or executing the TwiML from SmsUrl.' },
    smsFallbackMethod: { type: String, description: 'The HTTP method Twilio will use when requesting the above URL. Either GET or POST.' },
    smsStatusCallback: { type: String, description: 'The URL that Twilio will POST to when a message is sent via the /SMS/Messages endpoint if you specify the Sid of this application on an outgoing SMS request.' },
    uri: { type: String, description: 'The URI for this resource.' }
  },
  connector: 'appc.twilio'
})
