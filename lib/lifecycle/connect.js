exports.connect = function (next) {
  if (this.config.mockAPI) {
    this.twilioAPI = require('../../test/mocks/twilioAPIMock')(this.config)
  } else {
    this.twilioAPI = require('../../utils/twilioAPI')(this.config)
  }
  next()
}
