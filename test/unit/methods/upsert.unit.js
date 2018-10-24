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

  const sdkStub = sinon.stub(ENV.connector.sdk.update, 'address').callsFake((id, doc, callback) => {
    callback(errorMessage)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'address', nameOnlyPlural: 'addresses' }
  })

  const toolsCIStub = sinon.stub(ENV.connector.tools, 'createInstanceFromModel').callsFake((Model, modelsData, primaryKey) => {
    return modelFromStub
  })

  upsertMethod.call(ENV.connector, Model, id, doc, (err) => {
    t.ok(sdkStub.calledOnce)
    t.ok(sdkStub.calledWith(id, doc))
    t.ok(toolsCIStub.notCalled)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, errorMessage)

    sdkStub.restore()
    toolsGetNameStub.restore()
    toolsCIStub.restore()

    t.end()
  })
})

test('### updateAddress - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.address)
  const data = 'TestData'

  const sdkStubOk = sinon.stub(ENV.connector.sdk.update, 'address').callsFake((id, doc, callback) => {
    callback(null, data)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'address', nameOnlyPlural: 'addresses' }
  })

  const toolsCIStub = sinon.stub(ENV.connector.tools, 'createInstanceFromModel').callsFake((Model, modelsData, primaryKey) => {
    return modelFromStub
  })

  upsertMethod.call(ENV.connector, Model, id, doc, (err, arg) => {
    t.ok(sdkStubOk.calledOnce)
    t.ok(sdkStubOk.calledWith(id, doc))
    t.ok(toolsCIStub.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, null)
    t.equals(arg, modelFromStub)

    sdkStubOk.restore()
    toolsGetNameStub.restore()
    toolsCIStub.restore()

    t.end()
  })
})

test('### updateOutgoingCallerId - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.outgoingCallerId)

  const errorMessage = 'upsert error'

  const sdkStubError = sinon.stub(ENV.connector.sdk.update, 'outgoingCallerId').callsFake((id, doc, callback) => {
    callback(errorMessage)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'outgoingCallerId', nameOnlyPlural: 'outgoingCallerIds' }
  })

  const toolsCIStub = sinon.stub(ENV.connector.tools, 'createInstanceFromModel').callsFake((Model, modelsData, primaryKey) => {
    return modelFromStub
  })

  upsertMethod.call(ENV.connector, Model, id, doc, (err) => {
    t.ok(sdkStubError.calledOnce)
    t.ok(sdkStubError.calledWith(id, doc))
    t.ok(toolsCIStub.notCalled)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, errorMessage)

    sdkStubError.restore()
    toolsGetNameStub.restore()
    toolsCIStub.restore()

    t.end()
  })
})

test('### updateOutgoingCallerId - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.outgoingCallerId)

  const data = 'TestData'

  const sdkStubOk = sinon.stub(ENV.connector.sdk.update, 'outgoingCallerId').callsFake((id, doc, callback) => {
    callback(null, data)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'outgoingCallerId', nameOnlyPlural: 'outgoingCallerIds' }
  })

  const toolsCIStub = sinon.stub(ENV.connector.tools, 'createInstanceFromModel').callsFake((Model, modelsData, primaryKey) => {
    return modelFromStub
  })

  upsertMethod.call(ENV.connector, Model, id, doc, (err, arg) => {
    t.ok(sdkStubOk.calledOnce)
    t.ok(sdkStubOk.calledWith(id, doc))
    t.ok(toolsCIStub.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, null)
    t.equals(arg, modelFromStub)

    sdkStubOk.restore()
    toolsGetNameStub.restore()
    toolsCIStub.restore()

    t.end()
  })
})

test('### updateQueue - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.queue)

  const errorMessage = 'upsert error'

  const sdkStubError = sinon.stub(ENV.connector.sdk.update, 'queue').callsFake((id, doc, callback) => {
    callback(errorMessage)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'queue', nameOnlyPlural: 'queues' }
  })

  const toolsCIStub = sinon.stub(ENV.connector.tools, 'createInstanceFromModel').callsFake((Model, modelsData, primaryKey) => {
    return modelFromStub
  })

  upsertMethod.call(ENV.connector, Model, id, doc, (err) => {
    t.ok(sdkStubError.calledOnce)
    t.ok(sdkStubError.calledWith(id, doc))
    t.ok(toolsCIStub.notCalled)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, errorMessage)

    sdkStubError.restore()
    toolsGetNameStub.restore()
    toolsCIStub.restore()

    t.end()
  })
})

test('### updateQueue - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.queue)

  const data = 'TestData'

  const sdkStubOk = sinon.stub(ENV.connector.sdk.update, 'queue').callsFake((id, doc, callback) => {
    callback(null, data)
  })

  const toolsGetNameStub = sinon.stub(ENV.connector.tools, 'getRootModelName').callsFake((Model) => {
    return { nameOnly: 'queue', nameOnlyPlural: 'queues' }
  })

  const toolsCIStub = sinon.stub(ENV.connector.tools, 'createInstanceFromModel').callsFake((Model, modelsData, primaryKey) => {
    return modelFromStub
  })

  upsertMethod.call(ENV.connector, Model, id, doc, (err, arg) => {
    t.ok(sdkStubOk.calledOnce)
    t.ok(sdkStubOk.calledWith(id, doc))
    t.ok(toolsCIStub.calledOnce)
    t.ok(toolsGetNameStub.calledOnce)
    t.equals(err, null)
    t.equals(arg, modelFromStub)

    sdkStubOk.restore()
    toolsGetNameStub.restore()
    toolsCIStub.restore()

    t.end()
  })
})

test('Update With Invalid Model', function (t) {
  // To invoke the default clause in upsert.js we pass an invalid model name
  const Model = { name: 'appc.twilio/invalid' }
  const error = new Error('invalid model is either not known for the connector \n                        or does not support update operation')

  upsertMethod.call(ENV.connector, Model, '', {}, (err) => {
    t.deepEquals(err, error)
    t.end()
  })
})
