/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll (Model, callback) {
  const connector = this
  const modelName = this.tools.getRootModelName(Model).nameOnlyPlural
  connector.sdk.find.all(modelName, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, connector.tools.createCollectionFromModel(Model, data, Model.metadata.primaryKey))
    }
  })
}
