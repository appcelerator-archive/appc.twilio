const test = require('tap').test
const { server, connector } = require('./../../utils/server').startPlainArrow()
const findByIdMethod = require('../../../lib/methods/findByID')['findByID']
const twilioAPI = require('../../../utils/twilioAPI')(connector.config)
const sinon = require('sinon')
connector.twilioAPI = twilioAPI

test('### findById Call - Error Case ###', function (t) {
  const Model = server.getModel('call')

  const errorMessage = 'findById error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    twilioAPI.find,
    'byId',
    (Model, id, callback) => {
      callback(errorMessage)
    }
  )

  findByIdMethod.bind(connector, Model, '', cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### findById Call - Ok Case ###', function (t) {
  connector.twilioAPI = twilioAPI

  const Model = server.getModel('call')
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    twilioAPI.find,
    'byId',
    (Model, id, callback) => {
      callback(null, data)
    }
  )

  findByIdMethod.bind(connector, Model, '', cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})
