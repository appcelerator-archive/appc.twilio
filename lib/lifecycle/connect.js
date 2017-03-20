const Arrow = require('arrow')
const sdkFacade = require('./../../src/sdkFacade')
const transformer = require('./../../src/transformer')
exports.connect = function (next) {
  this.twilioAPI = require('../../src/twilioAPI')(this.config, sdkFacade(this.config), transformer)
  this.tools = require('appc-connector-utils')(Arrow, this)
  next()
}
