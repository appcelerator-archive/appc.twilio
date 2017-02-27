const sdkFacade = require('./../../utils/sdkFacade')
const transformer = require('./../../utils/transformer')
exports.connect = function (next) {
  this.twilioAPI = require('../../utils/twilioAPI')(this.config, sdkFacade(this.config), transformer)
  next()
}
