const test = require('tap').test
const utils = require('../../utils/serverUtils')()
const server = utils.startPlainArrow()
const connector = server.getConnector('appc.twilio')
const upsertMethod = require('../../../lib/methods/upsert')['upsert']
const twilioAPI = require('../../../src/twilioAPI')(connector.config)
const sinon = require('sinon')

test('connect', (t) => {
  connector.connect(err => {
    connector.twilioAPI = twilioAPI
    t.notOk(err)
    t.end()
  })
})

test('### updateAddress - Error Case ###', function (t) {
  const Model = utils.get().address

  const errorMessage = 'upsert error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI,
    'updateAddress',
    (Model, id, doc, callback) => {
      callback(errorMessage)
    }
  )

  upsertMethod.bind(connector, Model, '', {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### updateAddress - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = utils.get().address
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI,
    'updateAddress',
    (Model, id, doc, callback) => {
      callback(null, data)
    }
  )

  upsertMethod.bind(connector, Model, '', {}, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})

test('### updateOutgoingCallerId - Error Case ###', function (t) {
  const Model = utils.get().outgoingCallerId

  const errorMessage = 'upsert error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI,
    'updateOutgoingCallerId',
    (Model, id, doc, callback) => {
      callback(errorMessage)
    }
  )

  upsertMethod.bind(connector, Model, '', {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### updateOutgoingCallerId - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = utils.get().outgoingCallerId
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI,
    'updateOutgoingCallerId',
    (Model, id, doc, callback) => {
      callback(null, data)
    }
  )

  upsertMethod.bind(connector, Model, '', {}, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})

test('### updateQueue - Error Case ###', function (t) {
  const Model = utils.get().queue

  const errorMessage = 'upsert error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI,
    'updateQueue',
    (Model, id, doc, callback) => {
      callback(errorMessage)
    }
  )

  upsertMethod.bind(connector, Model, '', {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### updateQueue - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = utils.get().queue
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI,
    'updateQueue',
    (Model, id, doc, callback) => {
      callback(null, data)
    }
  )

  upsertMethod.bind(connector, Model, '', {}, cbOkSpy)()
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

  upsertMethod.bind(connector, Model, '', {}, cbErrorSpy)()
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  t.end()
})
