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

  const sdkStubError = sinon.stub(ENV.connector.sdk.find, 'all').callsFake((Model, callback) => {
    callback(errorMessage)
  })

  const toolsStubError = sinon.stub(ENV.connector.tools, 'createCollectionFromModel').callsFake((Model, modelsData, primaryKey) => {
    return []
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'call', nameOnlyPlural: 'calls' }
  })

  findAllMethod.call(ENV.connector, Model, (err) => {
    t.ok(sdkStubError.calledOnce)
    t.ok(toolsStubError.notCalled)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, errorMessage)

    sdkStubError.restore()
    toolsStubError.restore()
    toolsGetNameStub.restore()

    t.end()
  })
})

test('### findAll Call - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const data = 'MyCollectionWithModels'

  const sdkStubOk = sinon.stub(ENV.connector.sdk.find, 'all').callsFake((Model, callback) => {
    callback(null, {})
  })

  const toolsStubOk = sinon.stub(ENV.connector.tools, 'createCollectionFromModel').callsFake((Model, modelsData, primaryKey) => {
    return data
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'call', nameOnlyPlural: 'calls' }
  })

  findAllMethod.call(ENV.connector, Model, (err, arg) => {
    t.ok(sdkStubOk.calledOnce)
    t.ok(toolsStubOk.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(data, arg)
    t.equals(err, null)

    sdkStubOk.restore()
    toolsStubOk.restore()
    toolsGetNameStub.restore()

    t.end()
  })
})
