// This file is copied as template when you install this connector in arrow application
module.exports = {
  connectors: {
    'appc.twilio': {
      sid: '<MANDATORY. YOUR TWILLIO ACCOUNT SID>',
      auth_token: '<MANDATORY. YOUR TWILLIO ACCOUNT TOKEN>',
      twilio_number: '<MANDATORY. YOUR TWILLIO ACCOUNT NUMBER>',
      generateModels: '<OPTIONAL. ARRAY OF MODEL NAMES THAT NEED TO BE GENERATES>',
      modelAutogen: true,
      generateModelsFromSchema: true,
      skipModelNamespace: false,
      modelNamespace: '<OPTIONAL. OVERRIDES THE DEFAULT NAMESPACE VALUE WHICH IS SET TO THE NAME OF THE CONNECTOR.>',
      twilioWelcomeVoiceURL: 'https://demo.twilio.com/welcome/voice'
    }
  }
}
