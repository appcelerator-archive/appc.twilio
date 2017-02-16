var Arrow = require('arrow')

module.exports = Arrow.createModel('application', {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    date_created: { type: String, description: 'The date that this resource was created' },
    date_updated: { type: String, description: 'The date that this resource was last updated' },
    account_sid: { type: String, description: 'The unique id of the Account that created this application.' },
    friendly_name: { type: String, description: 'A human readable descriptive text for this resource, up to 64 characters long.' },
    api_version: { type: String, description: 'Requests to this application will start a new TwiML session with this API version' },
    voice_url: { type: String, description: 'The URL Twilio will request when a phone number assigned to this application receives a call.' },
    voice_method: { type: String, description: 'The HTTP method Twilio will use when requesting the above Url. ' },
    voice_fallback_url: { type: String, description: 'The URL that Twilio will request if an error occurs retrieving or executing the TwiML requested by Url.' },
    voice_fallback_method: { type: Object, description: 'The HTTP method Twilio will use when requesting the VoiceFallbackUrl. Either GET or POST.' },
    status_callback: { type: String, description: 'The URL that Twilio will request to pass status parameters (such as call ended) to your application.' },
    status_callback_method: { type: String, description: 'The HTTP method Twilio will use to make requests to the StatusCallback URL. Either GET or POST.' },
    voice_caller_id_lookup: { type: String, description: 'Look up the caller\'s caller-ID name from the CNAM database (additional charges apply). Either true or false.' },
    sms_url: { type: String, description: 'The URL Twilio will request when a phone number assigned to this application receives an incoming SMS message.' },
    sms_method: { type: String, description: 'The HTTP method Twilio will use when making requests to the SmsUrl. Either GET or POST.' },
    sms_fallback_url: { type: String, description: 'The URL that Twilio will request if an error occurs retrieving or executing the TwiML from SmsUrl.' },
    sms_fallback_method: { type: String, description: 'The HTTP method Twilio will use when requesting the above URL. Either GET or POST.' },
    sms_status_callback: { type: String, description: 'The URL that Twilio will POST to when a message is sent via the /SMS/Messages endpoint if you specify the Sid of this application on an outgoing SMS request.' },
    uri: { type: String, description: 'The URI for this resource.' }
  },
  connector: 'appc.twilio'
})
