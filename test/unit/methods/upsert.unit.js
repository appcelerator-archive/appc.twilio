const test = require('tap').test
const sinon = require('sinon')

const upsertMethod = require('../../../lib/methods/upsert')['upsert']

const ENV = {}
const connectorUtils = require('../../utils/connectorUtils')
const models = connectorUtils.models
const modelFromStub = 'MyModel'
const id = 'id'
const doc = 'doc'

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

test('### updateAddress - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.address)

  const errorMessage = 'upsert error'
  const cbErrorSpy = sinon.spy()

  const sdkStub = sinon.stub(
    ENV.connector.sdk.update,
    'address',
    (id, doc, callback) => {
      callback(errorMessage)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'address', nameOnlyPlural: 'addresses'}
    }
  )

  const toolsCIStub = sinon.stub(
    ENV.connector.tools,
    'createInstanceFromModel',
    (Model, modelsData, primaryKey) => {
      return modelFromStub
    }
  )

  upsertMethod.bind(ENV.connector, Model, id, doc, cbErrorSpy)()
  t.ok(sdkStub.calledOnce)
  t.ok(sdkStub.calledWith(id, doc))
  t.ok(toolsCIStub.notCalled)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  sdkStub.restore()
  toolsGetNameStub.restore()
  toolsCIStub.restore()

  t.end()
})

test('### updateAddress - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.address)
  const data = 'TestData'
  const cbOkSpy = sinon.spy()

  const sdkStubOk = sinon.stub(
    ENV.connector.sdk.update,
    'address',
    (id, doc, callback) => {
      callback(null, data)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'address', nameOnlyPlural: 'addresses'}
    }
  )

  const toolsCIStub = sinon.stub(
    ENV.connector.tools,
    'createInstanceFromModel',
    (Model, modelsData, primaryKey) => {
      return modelFromStub
    }
  )

  upsertMethod.bind(ENV.connector, Model, id, doc, cbOkSpy)()
  t.ok(sdkStubOk.calledOnce)
  t.ok(sdkStubOk.calledWith(id, doc))
  t.ok(toolsCIStub.calledOnce)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, modelFromStub))

  sdkStubOk.restore()
  toolsGetNameStub.restore()
  toolsCIStub.restore()

  t.end()
})

test('### updateOutgoingCallerId - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.outgoingCallerId)

  const errorMessage = 'upsert error'
  const cbErrorSpy = sinon.spy()

  const sdkStubError = sinon.stub(
    ENV.connector.sdk.update,
    'outgoingCallerId',
    (id, doc, callback) => {
      callback(errorMessage)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'outgoingCallerId', nameOnlyPlural: 'outgoingCallerIds'}
    }
  )

  const toolsCIStub = sinon.stub(
    ENV.connector.tools,
    'createInstanceFromModel',
    (Model, modelsData, primaryKey) => {
      return modelFromStub
    }
  )

  upsertMethod.bind(ENV.connector, Model, id, doc, cbErrorSpy)()
  t.ok(sdkStubError.calledOnce)
  t.ok(sdkStubError.calledWith(id, doc))
  t.ok(toolsCIStub.notCalled)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  sdkStubError.restore()
  toolsGetNameStub.restore()
  toolsCIStub.restore()

  t.end()
})

test('### updateOutgoingCallerId - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.outgoingCallerId)

  const data = 'TestData'
  const cbOkSpy = sinon.spy()

  const sdkStubOk = sinon.stub(
    ENV.connector.sdk.update,
    'outgoingCallerId',
    (id, doc, callback) => {
      callback(null, data)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'outgoingCallerId', nameOnlyPlural: 'outgoingCallerIds'}
    }
  )

  const toolsCIStub = sinon.stub(
    ENV.connector.tools,
    'createInstanceFromModel',
    (Model, modelsData, primaryKey) => {
      return modelFromStub
    }
  )

  upsertMethod.bind(ENV.connector, Model, id, doc, cbOkSpy)()
  t.ok(sdkStubOk.calledOnce)
  t.ok(sdkStubOk.calledWith(id, doc))
  t.ok(toolsCIStub.calledOnce)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, modelFromStub))

  sdkStubOk.restore()
  toolsGetNameStub.restore()
  toolsCIStub.restore()

  t.end()
})

test('### updateQueue - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.queue)

  const errorMessage = 'upsert error'
  const cbErrorSpy = sinon.spy()

  const sdkStubError = sinon.stub(
    ENV.connector.sdk.update,
    'queue',
    (id, doc, callback) => {
      callback(errorMessage)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'queue', nameOnlyPlural: 'queues'}
    }
  )

  const toolsCIStub = sinon.stub(
    ENV.connector.tools,
    'createInstanceFromModel',
    (Model, modelsData, primaryKey) => {
      return modelFromStub
    }
  )

  upsertMethod.bind(ENV.connector, Model, id, doc, cbErrorSpy)()
  t.ok(sdkStubError.calledOnce)
  t.ok(sdkStubError.calledWith(id, doc))
  t.ok(toolsCIStub.notCalled)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  sdkStubError.restore()
  toolsGetNameStub.restore()
  toolsCIStub.restore()

  t.end()
})

test('### updateQueue - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.queue)

  const data = 'TestData'
  const cbOkSpy = sinon.spy()

  const sdkStubOk = sinon.stub(
    ENV.connector.sdk.update,
    'queue',
    (id, doc, callback) => {
      callback(null, data)
    }
  )

  const toolsGetNameStub = sinon.stub(
    ENV.connector.tools,
    'getRootModelName',
    (Model) => {
      return {nameOnly: 'queue', nameOnlyPlural: 'queues'}
    }
  )

  const toolsCIStub = sinon.stub(
    ENV.connector.tools,
    'createInstanceFromModel',
    (Model, modelsData, primaryKey) => {
      return modelFromStub
    }
  )

  upsertMethod.bind(ENV.connector, Model, id, doc, cbOkSpy)()
  t.ok(sdkStubOk.calledOnce)
  t.ok(sdkStubOk.calledWith(id, doc))
  t.ok(toolsCIStub.calledOnce)
  t.ok(toolsGetNameStub.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, modelFromStub))

  sdkStubOk.restore()
  toolsGetNameStub.restore()
  toolsCIStub.restore()

  t.end()
})

test('Update With Invalid Model', function (t) {
  // To invoke the default clause in upsert.js we pass an invalid model name
  const Model = {name: 'appc.twilio/invalid'}
  const errorMessage = new Error()
  const cbErrorSpy = sinon.spy()

  upsertMethod.bind(ENV.connector, Model, '', {}, cbErrorSpy)()
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  t.end()
})
