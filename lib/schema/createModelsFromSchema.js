const modelFactories = require('../../src/models')

exports.createModelsFromSchema = function () {
  const connector = this
  const config = connector.config

  connector.models = Object.keys(modelFactories).reduce((models, modelName) => {
    const factory = modelFactories[modelName]
    const mn = config.skipModelNamespace ? `${modelName}` : `${config.modelNamespace || connector.name}/${modelName}`
    models[mn] = factory(connector.name, mn)
    return models
  }, {})
}
