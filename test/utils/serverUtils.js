const Arrow = require('arrow')
module.exports = () => {
  var server
  var connector

  return {
    /**
     * This one expose Arrow http server based on Express
     */
    startHTTPArrow: function (config, callback) {
      if (server) { return server }

      server = this.startPlainArrow(config).server
      server.start(function () {
        callback(server)
      })
    },
    /**
     * This one only instantiate Arrow so you can use connectors and models
     */
    startPlainArrow: function startPlainArrow (config) {
      if (server) {
        return server
      }

      server = new Arrow(config)
      return server
    },

    getConnector: (connectorName) => {
      if (connector) {
        return connector
      }

      connector = server.getConnector(connectorName)
      return connector
    },

    get: () => {
      return {
        account: server.getModel('appc.twilio/account'),
        address: server.getModel('appc.twilio/address'),
        application: server.getModel('appc.twilio/application'),
        availablePhoneNumber: server.getModel('appc.twilio/availablePhoneNumber'),
        call: server.getModel('appc.twilio/call'),
        conference: server.getModel('appc.twilio/conference'),
        incomingPhoneNumber: server.getModel('appc.twilio/incomingPhoneNumber'),
        key: server.getModel('appc.twilio/key'),
        message: server.getModel('appc.twilio/message'),
        outgoingCallerId: server.getModel('appc.twilio/outgoingCallerId'),
        queue: server.getModel('appc.twilio/queue'),
        recording: server.getModel('appc.twilio/recording'),
        transcription: server.getModel('appc.twilio/transcription')
      }
    }
  }
}

