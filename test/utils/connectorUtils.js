const Arrow = require('arrow')
const tools = require('appc-connector-utils')
const connectorName = 'appc.twilio'

const models = {
  call: `${connectorName}/call`,
  message: `${connectorName}/message`,
  address: `${connectorName}/address`,
  queue: `${connectorName}/queue`,
  account: `${connectorName}/account`,
  application: `${connectorName}/application`,
  availablePhoneNumber: `${connectorName}/availablePhoneNumber`,
  conference: `${connectorName}/conference`,
  incomingPhoneNumber: `${connectorName}/incomingPhoneNumber`,
  key: `${connectorName}/key`,
  outgoingCallerId: `${connectorName}/outgoingCallerId`,
  recording: `${connectorName}/recording`,
  transcription: `${connectorName}/transcription`
}

module.exports = {
  connectorName: connectorName,
  models: models,
  tools: tools(Arrow, connectorName),
  test: tools(Arrow, connectorName).test
}
