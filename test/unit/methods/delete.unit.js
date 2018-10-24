const test = require('tap').test
const sinon = require('sinon')

const deleteMethod = require('../../../lib/methods/delete')['delete']

const ENV = {}
const connectorUtils = require('../../utils/connectorUtils')
const models = connectorUtils.models

test('connect', (t) => {
  connectorUtils.test.getConnectorDynamic(connectorUtils.connectorName, env => {
    t.ok(env.container)
    t.ok(env.connector)
    ENV.container = env.container
    ENV.connector = env.connector
    ENV.connector.sdk = require('../../../src/sdkFacade')(ENV.connector.config)
    ENV.connector.tools = connectorUtils.tools
    t.end()
  })
})

test('### Delete Call - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const errorMessage = 'Deletion error'

  const sdkStub = sinon.stub(ENV.connector.sdk, 'deleteById').callsFake((Model, id, callback) => {
    callback(errorMessage)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'call', nameOnlyPlural: 'calls' }
  })

  deleteMethod.call(ENV.connector, Model, '', (err) => {
    t.ok(sdkStub.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, errorMessage)

    sdkStub.restore()
    toolsGetNameStub.restore()
    t.end()
  })
})

test('### Delete Call - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const data = 'TestData'

  const sdkStub = sinon.stub(ENV.connector.sdk, 'deleteById').callsFake((Model, id, callback) => {
    callback(null, data)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'call', nameOnlyPlural: 'calls' }
  })

  deleteMethod.call(ENV.connector, Model, '', (err, arg) => {
    t.ok(sdkStub.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, null)
    t.equals(arg, data)

    sdkStub.restore()
    toolsGetNameStub.restore()
    t.end()
  })
})
