module.exports = {
  fields: {
    friendlyName: { type: String, description: 'A nicely-formatted version of the phone number.' },
    phoneNumber: { type: String, description: 'The phone number, in E.164 (i.e. "+1") format.' },
    lata: { type: String, description: 'The LATA of this phone number.' },
    rateCenter: { type: String, description: 'The rate center of this phone number.' },
    latitude: { type: String, description: 'The latitude coordinate of this phone number.' },
    longitude: { type: String, description: 'The longitude coordinate of this phone number.' },
    region: { type: String, description: 'The two-letter state or province abbreviation of this phone number.' },
    postalCode: { type: String, description: 'The postal (zip) code of this phone number.' },
    isoCountry: { type: String, description: 'The ISO country code of this phone number.' },
    capabilities: { type: Object, description: 'This is a set of boolean properties that indicate whether a phone number can receive calls or messages' },
    beta: { type: Boolean, description: 'Phone numbers new to the Twilio platform are marked as beta. Possible values are either true or false.' }
  },
  actions: ['read'],
  disabledActions: ['findAll', 'findByID', 'count', 'distinct'],
  metadata: {
    primaryKey: 'phoneNumber'
  }
}

