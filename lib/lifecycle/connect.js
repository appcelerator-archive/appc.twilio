const sdkFacade = require('./../../src/sdkFacade')
const transformer = require('./../../src/transformer')
exports.connect = function (next) {
  this.twilioAPI = require('../../src/twilioAPI')(this.config, sdkFacade(this.config), transformer)
  next()
}
