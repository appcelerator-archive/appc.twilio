const Arrow = require('arrow')
const toolsFactory = require('appc-connector-utils')
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

const tools = toolsFactory(Arrow, connectorName)
module.exports = {
  connectorName: connectorName,
  models: models,
  tools: tools,
  test: tools.test
}
