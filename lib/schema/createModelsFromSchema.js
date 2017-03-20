const modelsMetadata = require('../../src/models')

exports.createModelsFromSchema = function () {
  this.tools.createModels(modelsMetadata)
}
