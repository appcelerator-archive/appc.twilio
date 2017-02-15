/**
 * Updates a model or creates the model if it cannot be found.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to update.
 * @param {Object} doc Model attributes to set.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated or new model.
 */
exports.upsert = function upsert (Model, id, doc, callback) {
  const connector = this
  const twilioAPI = connector.twilioAPI

  switch (Model.name) {
    case 'address':
      twilioAPI.updateAddress(Model, id, doc, (error, data) => {
        callback(error, data)
      })
      break
    case 'outgoingCallerId':
      twilioAPI.updateOutgoingCallerId(Model, id, doc, (error, data) => {
        callback(error, data)
      })
      break
    case 'queue':
      twilioAPI.updateQueue(Model, id, doc, (error, data) => {
        callback(error, data)
      })
      break
    default:
      break
  }
}
