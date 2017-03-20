const test = require('tap').test
const sinon = require('sinon')

const deleteMethod = require('../../../lib/methods/delete')['delete']

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

test('### Delete Call - Error Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const errorMessage = 'Deletion error'
  function cbError (errorMessage) { }
  const cbErrorSpy = sinon.spy(cbError)

  const twilioAPIStubError = sinon.stub(
    ENV.connector.twilioAPI,
    'deleteById',
    (Model, id, callback) => {
      callback(errorMessage)
    }
  )

  deleteMethod.bind(ENV.connector, Model, '', cbErrorSpy)()
  t.ok(twilioAPIStubError.calledOnce)
  t.ok(cbErrorSpy.calledOnce)
  t.ok(cbErrorSpy.calledWith(errorMessage))

  twilioAPIStubError.restore()
  t.end()
})

test('### Delete Call - Ok Case ###', function (t) {
  const Model = ENV.container.getModel(models.call)
  const data = 'TestData'
  function cbOk (errorMessage, data) { }
  const cbOkSpy = sinon.spy(cbOk)

  const twilioAPIStubOk = sinon.stub(
    ENV.connector.twilioAPI,
    'deleteById',
    (Model, id, callback) => {
      callback(null, data)
    }
  )

  deleteMethod.bind(ENV.connector, Model, '', cbOkSpy)()
  t.ok(twilioAPIStubOk.calledOnce)
  t.ok(cbOkSpy.calledOnce)
  t.ok(cbOkSpy.calledWith(null, data))

  twilioAPIStubOk.restore()
  t.end()
})
