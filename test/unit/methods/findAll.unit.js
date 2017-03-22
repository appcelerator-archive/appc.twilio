const test = require('tap').test
const sinon = require('sinon')

const findAllMethod = require('../../../lib/methods/findAll')['findAll']

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

test('### findAll Call - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)

  const errorMessage = 'findAll error'
  const cbErrorSpy = sinon.spy()

  const sdkStubError = sinon.stub(
    ENV.connector.sdk.find,
    'all',
    (Model, callback) => {
      callback(errorMessage)
    }
  )

  const toolsStubError = sinon.stub(
    ENV.connector.tools,
    'createCollectionFromModel',
    (Model, modelsData, primaryKey) => {
      return []
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'call', nameOnlyPlural: 'calls'}
    }
  )

  findAllMethod.bind(ENV.connector, Model, cbErrorSpy)()

  t.ok(sdkStubError.calledOnce)
  t.ok(toolsStubError.notCalled)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  sdkStubError.restore()
  toolsStubError.restore()
  toolsGetNameStub.restore()

  t.end()
})

test('### findAll Call - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const data = 'MyCollectionWithModels'
  const cbOkSpy = sinon.spy()

  const sdkStubOk = sinon.stub(
    ENV.connector.sdk.find,
    'all',
    (Model, callback) => {
      callback(null, {})
    }
  )

  const toolsStubOk = sinon.stub(
    ENV.connector.tools,
    'createCollectionFromModel',
    (Model, modelsData, primaryKey) => {
      return data
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'call', nameOnlyPlural: 'calls'}
    }
  )

  findAllMethod.bind(ENV.connector, Model, cbOkSpy)()

  t.ok(sdkStubOk.calledOnce)
  t.ok(toolsStubOk.calledOnce)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  sdkStubOk.restore()
  toolsStubOk.restore()
  toolsGetNameStub.restore()

  t.end()
})
