// This file is copied as template when you install this connector in arrow application
module.exports = {
  connectors: {
    'appc.twilio': {
      sid: '<YOUR TWILLIO ACCOUNT SID>',
      auth_token: '<YOUR TWILLIO ACCOUNT TOKEN>',
      twilio_number: '<YOUR TWILLIO ACCOUNT NUMBER>',
      modelAutogen: true,
      mockAPI: false
    }
  }
}
