module.exports = {
  fields: {
    sid: { type: String, description: 'A 34 character string that uniquely identifies this address.' },
    accountSid: { type: String, description: 'The unique id of the Account responsible for this address.' },
    friendlyName: { type: String, description: 'A human-readable description of the address. Maximum 64 characters.' },
    customerName: { type: String, description: 'Your name or business name, or that of your customer.' },
    street: { type: String, description: 'The number and street address where you or your customer is located.' },
    city: { type: String, description: 'The city in which you or your customer is located.' },
    region: { type: String, description: 'The state or region in which you or your customer is located.' },
    postalCode: { type: String, description: 'The postal code in which you or your customer is located.' },
    isoCountry: { type: String, required: true, description: 'The ISO country code of your or your customers address.' }
  },
  actions: ['create', 'read', 'update'],
  disabledActions: ['count', 'distinct'],
  metadata: {
    primaryKey: 'sid'
  }
}
