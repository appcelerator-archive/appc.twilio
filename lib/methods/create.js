//const bl = require()
/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
exports.create = function (Model, values, callback) {
  const connector = this
  const number = connector.config.twilio_number
  const twilioAPI = connector.twilioAPI

  switch (Model.name) {
    case 'call':
      twilioAPI.createCall(Model, values, number, (error, data) => {
        if (error) {
          callback(error)  
        } else {
          //Business Logic
          data = "MyDataPrim"
          //bl.doProcessing(data)
          callback(null, data)
        }
      })
      break
    case 'address':
      twilioAPI.createAddress(Model, values, (error, data) => {
        callback(error, data)
      })
      break
    case 'message':
      twilioAPI.createMessage(Model, values, number, (error, data) => {
        callback(error, data)
      })
      break
    case 'queue':
      twilioAPI.createQueue(Model, values, number, (error, data) => {
        callback(error, data)
      })
      break
    case 'outgoingCallerId':
      twilioAPI.createOutgoingCallerId(Model, values, number, (error, data) => {
        callback(error, data)
      })
      break
    case 'account':
      twilioAPI.createAccount(Model, number, (error, data) => {
        callback(error, data)
      })
      break
    default:
      callback(new Error('Unavailable create endpoint!'))
      break
  }
}
