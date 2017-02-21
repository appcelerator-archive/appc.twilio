const test = require('tap').test
const { server, connector } = require('./../utils/server').startPlainArrow()
const findAllMethod = require('../../lib/methods/findAll')['findAll']
const twilioAPI = require('../../utils/twilioAPI')(connector.config)
const sinon = require('sinon')
connector.twilioAPI = twilioAPI

test('### findAll Call - Error Case ###', function (t) {
  const Model = server.getModel('call')

  const errorMessage = 'findAll error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI.find,
    'all',
    (Model, callback) => {
      callback(errorMessage)
    }
  )

  findAllMethod.bind(connector, Model, cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### findAll Call - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = server.getModel('call')
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI.find,
    'all',
    (Model, callback) => {
      callback(null, data)
    }
  )

  findAllMethod.bind(connector, Model, cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})
