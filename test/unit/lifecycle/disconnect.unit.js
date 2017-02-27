const test = require('tap').test
const sinon = require('sinon')
const disconnect = require('./../../../lib/lifecycle/disconnect')
function cb (errorMessage, data) { }
const cbSpy = sinon.spy(cb)

test('### disconnect', function (t) {
  disconnect.disconnect(cbSpy)

  t.ok(cbSpy.calledOnce)

  cbSpy.reset()
  t.end()
})
