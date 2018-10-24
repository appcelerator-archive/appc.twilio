const test = require('tap').test
const sinon = require('sinon')

const connect = require('./../../../lib/lifecycle/connect').connect

const connectorUtils = require('../../utils/connectorUtils')
const ENV = connectorUtils.test.getConnectorStatic(connectorUtils.connectorName)

test('connect', function (t) {
  function cb (errorMessage, data) { }
  const cbSpy = sinon.spy(cb)
  const connectInContext = connect.bind(ENV.connector)
  connectInContext(cbSpy)
  t.ok(ENV.connector.sdk)
  t.ok(ENV.connector.tools)
  cbSpy.resetHistory()
  t.end()
})
