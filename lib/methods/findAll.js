/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll (Model, callback) {
  const connector = this
  const twilioAPI = connector.twilioAPI

  twilioAPI.find.all(Model, (error, data) => {
    callback(error, data)
  })
}
