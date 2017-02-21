const test = require('tap').test
const { server, connector } = require('./../utils/server').startPlainArrow()
const upsertMethod = require('../../lib/methods/upsert')['upsert']
const twilioAPI = require('../../utils/twilioAPI')(connector.config)
const sinon = require('sinon')
connector.twilioAPI = twilioAPI

test('### updateAddress - Error Case ###', function (t) {
  const Model = server.getModel('address')

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

  const Model = server.getModel('address')
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
  const Model = server.getModel('outgoingCallerId')

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

  const Model = server.getModel('outgoingCallerId')
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
  const Model = server.getModel('queue')

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

  const Model = server.getModel('queue')
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
