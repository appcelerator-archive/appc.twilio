// This file is copied as template when you install this connector in arrow application
module.exports = {
  connectors: {
    'appc.twilio': {
      skipModelNamespace: '<DEFAULT IS FALSE AND WILL NAMESPACE THE MODEL WITH CONNECTOR NAME>',
      modelNamespace: '<OPTIONAL. THIS IS THE WAY WE CAN OVERRIDE THE DEFAULT NAMESPACE WHICH IS THE CONNECTOR NAME.>',
      sid: '<YOUR TWILLIO ACCOUNT SID>',
      auth_token: '<YOUR TWILLIO ACCOUNT TOKEN>',
      twilio_number: '<YOUR TWILLIO ACCOUNT NUMBER>',
      modelAutogen: true,
      twilioWelcomeVoiceURL: 'https://demo.twilio.com/welcome/voice',

      // Needed for integration test suite only
      outgoing_caller_data: {
        to: '<THE RECEIVING PHONE NUMBER>'
      }
    }
  }
}
