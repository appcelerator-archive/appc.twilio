const modelFactories = require('../../src/models')

exports.createModelsFromSchema = function () {
  const connector = this

  connector.models = Object.keys(modelFactories).reduce((models, modelName) => {
    const factory = modelFactories[modelName]
    const mn = `${connector.name}/${modelName}`
    models[mn] = factory(connector.name, mn)
    return models
  }, {})
}
