/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
  const connector = this
  const modelName = this.tools.getRootModelName(Model).nameOnlyPlural
  connector.sdk.find.byId(modelName, id, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, connector.tools.createInstanceFromModel(Model, data, Model.metadata.primaryKey))
    }
  })
}
