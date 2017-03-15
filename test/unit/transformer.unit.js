const test = require('tap').test
const transformer = require('../../src/transformer')
const mockedData = require('../data/mockData').calls
const arrow = require('../utils/server').startPlainArrow()

test('connect', (t) => {
  arrow.connector.connect(err => {
    t.notOk(err)
    t.end()
  })
})

test('### transformToCollection', function (t) {
  const model = arrow.server.getModel('appc.twilio/call')

  const result = transformer.transformToCollection(model, mockedData)
  t.ok(result)
  t.ok(result instanceof Array)

  t.end()
})

test('### transformToModel ###', function (t) {
  const model = arrow.server.getModel('appc.twilio/call')

  var result = transformer.transformToModel(model, mockedData[0])
  t.ok(result)
  t.equal(typeof result, 'object')

  t.end()
})
