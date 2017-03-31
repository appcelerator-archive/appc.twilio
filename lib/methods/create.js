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
    createFunction(values, (err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, constructResponse(data))
      }
    })
  } else {
    callback(new Error(`${modelNameInfo.nameOnly} model is either not known for the connector 
                        or does not support create operation`))
  }

  /**
   * Created Model instance contains a lot of properties
   * that for some reason prevents the visualisation of the model in the Admin UI.
   *
   * Filters the models properties so the Model is visualised correctly
   *
   * @param {Object} data the model metadata
   */
  function constructResponse (data) {
    const response = {}
    const instance = connector.tools.createInstanceFromModel(Model, data, Model.metadata.primaryKey)
    for (var prop in data) {
      if (instance.hasOwnProperty(prop)) {
        response[prop] = instance[prop]
      }
    }
    return response
  }
}
