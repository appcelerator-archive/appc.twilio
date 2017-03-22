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
  const cbErrorSpy = sinon.spy()

  const sdkStub = sinon.stub(
    ENV.connector.sdk,
    'deleteById',
    (Model, id, callback) => {
      callback(errorMessage)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'call', nameOnlyPlural: 'calls'}
    }
  )

  deleteMethod.bind(ENV.connector, Model, '', cbErrorSpy)()
  t.ok(sdkStub.calledOnce)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  sdkStub.restore()
  toolsGetNameStub.restore()
  t.end()
})

test('### Delete Call - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const data = 'TestData'
  const cbOkSpy = sinon.spy()

  const sdkStub = sinon.stub(
    ENV.connector.sdk,
    'deleteById',
    (Model, id, callback) => {
      callback(null, data)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'call', nameOnlyPlural: 'calls'}
    }
  )

  deleteMethod.bind(ENV.connector, Model, '', cbOkSpy)()
  t.ok(sdkStub.calledOnce)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  sdkStub.restore()
  toolsGetNameStub.restore()
  t.end()
})
