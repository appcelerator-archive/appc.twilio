module.exports = {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    accountSid: { type: String, description: 'The unique id of the Account responsible for this phone number.' },
    friendlyName: { type: String, description: 'A human readable descriptive text for this resource, up to 64 characters long. By default, the FriendlyName is a nicely formatted version of the phone number.' },
    phoneNumber: { type: String, description: 'The incoming phone number. e.g., +16175551212 (E.164 format)' },
    voiceUrl: { type: String, description: 'The URL Twilio will request when this phone number receives a call. The VoiceURL will no longer be used if a VoiceApplicationSid or a TrunkSid is set.' },
    voiceMethod: { type: String, description: 'The HTTP method Twilio will use when requesting the above Url. Either GET or POST.' },
    voiceFallbackUrl: { type: String, description: 'The URL that Twilio will request if an error occurs retrieving or executing the TwiML requested by Url.' },
    voiceFallbackMethod: { type: String, description: 'The HTTP method Twilio will use when requesting the VoiceFallbackUrl. Either GET or POST.' },
    voiceApplicationSid: { type: String, description: 'The 34 character sid of the application Twilio should use to handle phone calls to this number.' },
    dateCreated: { type: String, description: 'The date that this resource was created, given as GMT RFC 2822 format.' },
    dateUpdated: { type: String, description: 'The date that this resource was last updated, given as GMT RFC 2822 format.' },
    smsUrl: { type: String, description: 'The URL Twilio will request when receiving an incoming SMS message to this number.' },
    smsMethod: { type: String, description: 'The HTTP method Twilio will use when making requests to the SmsUrl. Either GET or POST.' },
    smsFallbackUrl: { type: String, description: 'The URL that Twilio will request if an error occurs retrieving or executing the TwiML from SmsUrl.' },
    smsFallbackMethod: { type: String, description: 'The HTTP method Twilio will use when requesting the above URL. Either GET or POST.' },
    smsApplicationSid: { type: String, description: 'The 34 character sid of the application Twilio should use to handle SMSs sent to this number. If a SmsApplicationSid is present, Twilio will ignore all of the SMS urls above and use those set on the application.' },
    capabilities: { type: Object, description: 'This is a set of boolean properties that indicate whether a phone number can receive calls or messages. Possible capabilities are Voice, SMS, and MMS with each having a value of either true or false.' },
    beta: { type: Boolean, description: 'Phone numbers new to the Twilio platform are marked as beta. Possible values are either true or false.' },
    statusCallback: { type: String, description: 'The URL that Twilio will request to pass status parameters (such as call ended) to your application.' },
    statusCallbackMethod: { type: String, description: 'The HTTP method Twilio will use to make requests to the StatusCallback URL. Either GET or POST.' },
    apiVersion: { type: String, description: 'Version of Twilio API' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com.' }
  }
}

