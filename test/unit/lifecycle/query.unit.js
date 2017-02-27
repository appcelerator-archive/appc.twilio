const test = require('tap').test
const { server, connector } = require('./../../utils/server').startPlainArrow()
const queryMethod = require('../../../lib/methods/query')['query']
const twilioAPI = require('../../../utils/twilioAPI')(connector.config)
const sinon = require('sinon')
connector.twilioAPI = twilioAPI

test('### query Call - Error Case ###', function (t) {
  const Model = server.getModel('call')

  const errorMessage = 'query error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI,
    'query',
    (Model, id, callback) => {
      callback(errorMessage)
    }
  )

  queryMethod.bind(connector, Model, {}, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### query Call - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = server.getModel('call')
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI,
    'query',
    (Model, options, callback) => {
      callback(null, data)
    }
  )

  queryMethod.bind(connector, Model, {}, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})
