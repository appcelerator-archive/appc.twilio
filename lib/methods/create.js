/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */
exports.create = function (Model, values, callback) {
  const connector = this
  const modelNameInfo = connector.tools.getRootModelName(Model)
  const createFunction = connector.sdk.create[modelNameInfo.nameOnly]
  if (createFunction) {
    createFunction(modelNameInfo.nameOnlyPlural, values, (err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, connector.tools.createInstanceFromModel(Model, data, Model.metadata.primaryKey))
      }
    })
  } else {
    callback(new Error(`${modelNameInfo.nameOnly} model is either not known for the connector 
                        or does not support create operation`))
  }
}
