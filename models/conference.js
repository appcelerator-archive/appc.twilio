var Arrow = require('arrow')

module.exports = Arrow.createModel('conference', {
  fields: {
    apiVersion: { type: String, description: 'Version of the Twilio API' },
    dateUpdated: { type: String, description: 'The date that this conference was last updated, given as GMT in RFC 2822 format.' },
    dateCreated: { type: String, description: 'The date that this conference was created, given as GMT in RFC 2822 format.' },
    friendlyName: { type: String, description: 'A user provided string that identifies this conference room.' },
    sid: { type: String, description: 'A 34 character string that uniquely identifies this conference.' },
    status: { type: String, description: 'A string representing the status of the conference. May be in-progress or completed.' },
    subresourceUris: { type: Object, description: 'The subresource URI for this resource' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com.' }
  },
  connector: 'appc.twilio'
})
