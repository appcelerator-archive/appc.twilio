const test = require('tap').test
const sinon = require('sinon')

const disconnect = require('./../../../lib/lifecycle/disconnect').disconnect

test('disconnect', function (t) {
  function cb (errorMessage, data) { }
  const cbSpy = sinon.spy(cb)
  disconnect(cbSpy)
  t.ok(cbSpy.calledOnce)
  cbSpy.reset()
  t.end()
})
