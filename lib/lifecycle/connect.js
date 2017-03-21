const Arrow = require('arrow')
const sdkFacade = require('./../../src/sdkFacade')
exports.connect = function (next) {
  this.tools = require('appc-connector-utils')(Arrow, this)
  this.twilioAPI = require('../../src/twilioAPI')(this.config, sdkFacade(this.config), this.tools)
  next()
}
