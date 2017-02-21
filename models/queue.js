var Arrow = require('arrow')

module.exports = Arrow.createModel('queue', {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this queue.' },
    friendlyName: { type: String, required: true, description: 'A user-provided string that identifies this queue.' },
    currentSize: { type: Number, description: 'The count of calls currently in the queue.' },
    averageWaitTime: { type: Number, description: 'The average wait time of the members of this queue in seconds. This is calculated at the time of the request.' },
    maxSize: { type: Number, required: true, description: 'The maximum size of this queue. The default is 100. The maximum is 1000.' },
    dateCreated: { type: String, description: 'The date that this resource was created' },
    dateUpdated: { type: String, description: 'The date that this resource was updated' },
    uri: { type: String, description: 'The URI for this resource, relative to https://api.twilio.com.' }
  },
  connector: 'appc.twilio'
})
