const test = require('tap').test
const { server } = require('../utils/server').startPlainArrow()
const transformer = require('./../../utils/transformer')
const mockedData = require('./../data/mockData').calls

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
