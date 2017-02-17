var Arrow = require('arrow')

module.exports = Arrow.createModel('availablePhoneNumber', {
  fields: {
    friendlyName: { type: String },
    phoneNumber: { type: String },
    lata: { type: String },
    rateCenter: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    region: { type: String },
    postalCode: { type: String },
    isoCountry: { type: String },
    capabilities: { type: Object },
    beta: { type: Boolean }
  },
  connector: 'appc.twilio'
})
