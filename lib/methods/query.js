/**
 * Queries for particular model records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
const Arrow = require('arrow')

exports.query = function (Model, options, callback) {
  const connector = this
  const modelNameInfo = connector.tools.getRootModelName(Model).nameOnlyPlural
  if (modelNameInfo === 'availablePhoneNumbers') {
    const criteria = getCriteria(options)
    if (typeof criteria !== 'string') {
      return callback(criteria)
    }

    connector.sdk.queryAvailablePhoneNumbers(modelNameInfo, criteria, (err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, connector.tools.createCollectionFromModel(Model, data, Model.metadata.primaryKey))
      }
    })
  } else {
    connector.sdk.query(modelNameInfo, options, (err, data) => {
      if (err) {
        callback(err)
      } else {
        callback(null, connector.tools.createCollectionFromModel(Model, data, Model.metadata.primaryKey))
      }
    })
  }

  function getCriteria (query) {
    const criteria = query.where.region || query.where.isoCountry

    if (typeof criteria === 'string') {
      return criteria.toUpperCase()
    }

    return new Arrow.ORMError('Invalid criteria!')
  }
}
