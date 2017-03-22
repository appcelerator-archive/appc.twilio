/**
 * Queries for particular model records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
exports.query = function (Model, options, callback) {
  const connector = this
  const modelNameInfo = connector.tools.getRootModelName(Model)
  connector.sdk.query(modelNameInfo.nameOnly, options, (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(null, connector.tools.createCollectionFromModel(Model, data, Model.metadata.primaryKey))
    }
  })
}
