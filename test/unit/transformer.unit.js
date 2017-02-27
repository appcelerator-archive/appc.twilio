const test = require('tap').test
const { server } = require('../utils/server').startPlainArrow()
const transformer = require('./../../utils/transformer')
const mockedData = require('./../data/mockData').calls
const sinon = require('sinon')
const disconnect = require('./../../lib/lifecycle/disconnect')
function cb (errorMessage, data) { }
const cbSpy = sinon.spy(cb)

test('### disconnect', function (t) {
  disconnect.disconnect(cbSpy)

  t.ok(cbSpy.calledOnce)

  cbSpy.reset()
  t.end()
})

test('### transformToCollection', function (t) {
  const model = server.getModel('call')

  const result = transformer.transformToCollection(model, mockedData)
  t.ok(result)
  t.ok(result instanceof Array)

  t.end()
})

test('### transformToModel ###', function (t) {
  const model = server.getModel('call')

  var result = transformer.transformToModel(model, mockedData[0])
  t.ok(result)
  t.equal(typeof result, 'object')

  t.end()
})
