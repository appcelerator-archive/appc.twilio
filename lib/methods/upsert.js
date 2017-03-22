/**
 * Updates a model or creates the model if it cannot be found.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to update.
 * @param {Object} doc Model attributes to set.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated or new model.
 */
exports.upsert = function (Model, id, doc, callback) {
  const connector = this
  const modelNameInfo = connector.tools.getRootModelName(Model)
  const updateFunction = connector.sdk.update[modelNameInfo.nameOnly]
  if (updateFunction) {
    updateFunction(id, doc, (err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, connector.tools.createInstanceFromModel(Model, data, Model.metadata.primaryKey))
      }
    })
  } else {
    callback(new Error(`${modelNameInfo.nameOnly} model is either not known for the connector 
                        or does not support update operation`))
  }
}
