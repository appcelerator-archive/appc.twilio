const test = require('tap').test
const sinon = require('sinon')

const upsertMethod = require('../../../lib/methods/upsert')['upsert']

const ENV = {}
const connectorUtils = require('../../utils/connectorUtils')
const models = connectorUtils.models

test('connect', (t) => {
  connectorUtils.test.getConnectorDynamic(connectorUtils.connectorName, env => {
    t.ok(env.container)
    t.ok(env.connector)
    ENV.container = env.container
    ENV.connector = env.connector
    ENV.connector.twilioAPI = require('../../../src/twilioAPI')()
    t.end()
  })
})

test('### updateAddress - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.address)

  const errorMessage = 'upsert error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    ENV.connector.twilioAPI,
    'updateAddress',
    (Model, id, doc, callback) => {
      callback(errorMessage)
    }
  )

  upsertMethod.bind(ENV.connector, Model, '', {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### updateAddress - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.address)
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    ENV.connector.twilioAPI,
    'updateAddress',
    (Model, id, doc, callback) => {
      callback(null, data)
    }
  )

  upsertMethod.bind(ENV.connector, Model, '', {}, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})

test('### updateOutgoingCallerId - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.outgoingCallerId)

  const errorMessage = 'upsert error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    ENV.connector.twilioAPI,
    'updateOutgoingCallerId',
    (Model, id, doc, callback) => {
      callback(errorMessage)
    }
  )

  upsertMethod.bind(ENV.connector, Model, '', {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### updateOutgoingCallerId - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.outgoingCallerId)

  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    ENV.connector.twilioAPI,
    'updateOutgoingCallerId',
    (Model, id, doc, callback) => {
      callback(null, data)
    }
  )

  upsertMethod.bind(ENV.connector, Model, '', {}, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})

test('### updateQueue - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.queue)

  const errorMessage = 'upsert error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    ENV.connector.twilioAPI,
    'updateQueue',
    (Model, id, doc, callback) => {
      callback(errorMessage)
    }
  )

  upsertMethod.bind(ENV.connector, Model, '', {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### updateQueue - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.queue)

  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    ENV.connector.twilioAPI,
    'updateQueue',
    (Model, id, doc, callback) => {
      callback(null, data)
    }
  )

  upsertMethod.bind(ENV.connector, Model, '', {}, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})

test('Update With Invalid Model', function (t) {
  // To invoke the default clause in upsert.js we pass an invalid model name
  const Model = {name: 'appc.twilio/invalid'}
  const errorMessage = new Error()
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  upsertMethod.bind(ENV.connector, Model, '', {}, cbErrorSpy)()
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  t.end()
})
