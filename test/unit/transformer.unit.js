const test = require('tap').test
const transformer = require('../../src/transformer')
const mockedData = require('../data/mockData').calls

const ENV = {}
const connectorUtils = require('../utils/connectorUtils')
const models = connectorUtils.models

test('connect', (t) => {
  connectorUtils.test.getConnectorDynamic(connectorUtils.connectorName, env => {
    t.ok(env.container)
    t.ok(env.connector)
    ENV.container = env.container
    ENV.connector = env.connector
    t.end()
  })
})

test('### transformToCollection', function (t) {
  const model = ENV.container.getModel(models.call)

  const result = transformer.transformToCollection(model, mockedData)
  t.ok(result)
  t.ok(result instanceof Array)

  t.end()
})

test('### transformToModel ###', function (t) {
  const model = ENV.container.getModel(models.call)

  var result = transformer.transformToModel(model, mockedData[0])
  t.ok(result)
  t.equal(typeof result, 'object')

  t.end()
})
