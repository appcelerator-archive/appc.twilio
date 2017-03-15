const Arrow = require('arrow')

module.exports = (connectorName, modelName) => {
  return Arrow.createModel(modelName, {
    fields: {
      dateUpdated: { type: String, description: 'The date-time this API Key was most recently updated, given as a UTC ISO 8601 Timestamp.' },
      dateCreated: { type: String, description: 'The date-time this API Key was created, given as a UTC ISO 8601 Timestamp.' },
      friendlyName: { type: String, description: 'A descriptive string for this resource, chosen by your application, up to 64 characters long.' },
      sid: { type: String, description: 'A 34 character string that uniquely identifies this API Key. You will use this as the basic-auth user when authenticating to the API.' }
    },
    connector: connectorName
  })
}
