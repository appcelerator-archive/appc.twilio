const Arrow = require('arrow')

exports.connect = function (next) {
  this.sdk = require('./../../src/sdkFacade')(this.config)
  this.tools = require('appc-connector-utils')(Arrow, this)
  next()
}
