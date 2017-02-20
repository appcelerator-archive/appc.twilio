const Arrow = require('arrow')
module.exports = {
  /**
   * This one expose Arrow http server based on Express
   */
  startHTTPArrow: function (config, callback) {
    const { server } = this.startPlainArrow(config)
    server.start(function () {
      callback(server)
    })
  },
  /**
   * This one only instantiate Arrow so you can use connectors and models
   */
  startPlainArrow: function (config) {
    const server = new Arrow(config)
    const connector = server.getConnector('appc.twilio')
    return { server, connector }
  }
}

