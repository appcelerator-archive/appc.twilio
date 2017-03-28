module.exports = {
  fields: {
    accountSid: { type: String, description: 'The unique id of the Account responsible for this transcription.' },
    apiVersion: { type: String, description: 'Version of the Twilio API' },
    dateCreated: { type: String, description: 'The date that this resource was created, given in RFC 2822 format.' },
    dateUpdated: { type: String, description: 'The date that this resource was last updated, given in RFC 2822 format.' },
    duration: { type: String, description: 'The duration of the transcribed audio, in seconds.' },
    price: { type: String, description: 'The charge for this transcript in the currency associated with the account. Populated after the transcript is completed. Note, this value may not be immediately available.' },
    recordingSid: { type: String, description: 'The unique id of the Recording this Transcription was made of.' },
    sid: { type: String, description: 'A 34 character string that uniquely identifies this resource.' },
    status: { type: String, description: 'A string representing the status of the transcription: in-progress, completed or failed.' },
    transcriptionText: { type: String, description: 'The text content of the transcription.' },
    type: { type: String, description: 'The type of the transcription' },
    url: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com' }
  },
  actions: ['read', 'delete'],
  disabledActions: ['count', 'distinct', 'query'],
  metadata: {
    primaryKey: 'sid'
  }
}

