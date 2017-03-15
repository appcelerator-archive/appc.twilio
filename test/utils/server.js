const Arrow = require('arrow')
module.exports = {
  /**
   * This one expose Arrow http server based on Express
   */
  startHTTPArrow: function (config, callback) {
    const server = this.startPlainArrow(config).server
    server.start(function () {
      callback(server)
    })
  },
  /**
   * This one only instantiate Arrow so you can use connectors and models
   */
  startPlainArrow: function startPlainArrow (config) {
    const server = new Arrow(config)
    const connector = server.getConnector('appc.twilio')
    return { server: server, connector: connector }
  },

  get: (server) => {
    return {
      account: server.getModel('appc.twilio/account'),
      address: require('appc.twilio/address'),
      application: require('appc.twilio/application'),
      availablePhoneNumber: require('appc.twilio/availablePhoneNumber'),
      call: require('appc.twilio/call'),
      conference: require('appc.twilio/conference'),
      incomingPhoneNumber: require('appc.twilio/incomingPhoneNumber'),
      key: require('appc.twilio/key'),
      message: require('appc.twilio/message'),
      outgoingCallerId: require('appc.twilio/outgoingCallerId'),
      queue: require('appc.twilio/queue'),
      recording: require('appc.twilio/recording'),
      transcription: require('appc.twilio/transcription')
    }
  }

  // TODO add connector.connect
}

