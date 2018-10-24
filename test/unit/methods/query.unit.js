const test = require('tap').test
const sinon = require('sinon')

const queryMethod = require('../../../lib/methods/query')['query']

const ENV = {}
const connectorUtils = require('../../utils/connectorUtils')
const models = connectorUtils.models
const options = {
  limit: 1,
  where: {
    region: 'US'
  }
}

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

test('### query Call - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)

  const errorMessage = 'query error'

  const sdkStubError = sinon.stub(ENV.connector.sdk, 'query').callsFake((Model, id, callback) => {
    callback(errorMessage)
  })

  const toolsStubError = sinon.stub(ENV.connector.tools, 'createCollectionFromModel').callsFake((Model, modelsData, primaryKey) => {
    return []
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'call', nameOnlyPlural: 'calls' }
  })

  queryMethod.call(ENV.connector, Model, options, (err) => {
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

test('### query Call - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const data = 'TestData'

  const sdkStubOk = sinon.stub(ENV.connector.sdk, 'query').callsFake((Model, options, callback) => {
    callback(null, data)
  })

  const toolsStubOk = sinon.stub(ENV.connector.tools, 'createCollectionFromModel').callsFake((Model, modelsData, primaryKey) => {
    return data
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'call', nameOnlyPlural: 'calls' }
  })

  queryMethod.call(ENV.connector, Model, options, (err, arg) => {
    t.ok(sdkStubOk.calledOnce)
    t.ok(toolsStubOk.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(arg, data)
    t.equals(err, null)

    sdkStubOk.restore()
    toolsStubOk.restore()
    toolsGetNameStub.restore()
    t.end()
  })
})

test('### query availablePhoneNumbers - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.availablePhoneNumber)

  const errorMessage = 'query error'

  const sdkStubError = sinon.stub(ENV.connector.sdk, 'queryAvailablePhoneNumbers').callsFake((Model, id, callback) => {
    callback(errorMessage)
  })

  const toolsStubError = sinon.stub(ENV.connector.tools, 'createCollectionFromModel').callsFake((Model, modelsData, primaryKey) => {
    return []
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'availablePhoneNumber', nameOnlyPlural: 'availablePhoneNumbers' }
  })

  queryMethod.call(ENV.connector, Model, options, (err) => {
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

test('### query availablePhoneNumbers - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.availablePhoneNumber)
  const data = 'TestData'

  const sdkStubOk = sinon.stub(ENV.connector.sdk, 'queryAvailablePhoneNumbers').callsFake((Model, options, callback) => {
    callback(null, data)
  })

  const toolsStubOk = sinon.stub(ENV.connector.tools, 'createCollectionFromModel').callsFake((Model, modelsData, primaryKey) => {
    return data
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'availablePhoneNumber', nameOnlyPlural: 'availablePhoneNumbers' }
  })

  queryMethod.call(ENV.connector, Model, options, (err, arg) => {
    t.ok(sdkStubOk.calledOnce)
    t.ok(toolsStubOk.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, null)
    t.equals(arg, data)

    sdkStubOk.restore()
    toolsStubOk.restore()
    toolsGetNameStub.restore()
    t.end()
  })
})

test('### query availablePhoneNumbers - Invalid Query Case ###', function (t) {
  const Model = ENV.container.getModel(models.availablePhoneNumber)
  options.where = {}

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'availablePhoneNumber', nameOnlyPlural: 'availablePhoneNumbers' }
  })

  queryMethod.call(ENV.connector, Model, options, () => {
    t.ok(toolsGetNameStub.calledOnce)

    toolsGetNameStub.restore()
    t.end()
  })
})
