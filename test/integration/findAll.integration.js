const test = require('tap').test
const server = require('../utils/server')
const requester = require('../utils/requester')

var SERVER
var REQUESTER

test('### START SERVER ###', function (t) {
  server.startHTTPArrow({}, arrow => {
    t.ok(arrow, 'Arrow has been started')
    SERVER = arrow
    REQUESTER = requester(SERVER.config)
    t.end()
  })
})

test('Should return proper status code when valid request is made', t => {
  const modelName = 'message'

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')

    t.end()
  })
})

test('Should return proper response when INVALID find all request is made', t => {
  const modelName = 'invalid'

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.notOk(body.success, 'Body success should be false when invalid request is made')
    t.equal(response.statusCode, 404, 'status code should be 404')
    t.equal(body.error, 'Not found')

    t.end()
  })
})

test('Should return proper response format when request is made to message endpoint', t => {
  const modelName = 'message'
  const expectedProperties = [
    'id',
    'sid',
    'dateCreated',
    'dateUpdated',
    'dateSent',
    'accountSid',
    'to',
    'from',
    'body',
    'status',
    'numSegments',
    'numMedia',
    'direction',
    'apiVersion',
    'price',
    'priceUnit',
    'uri',
    'subresourceUris'
  ]

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')

    body.messages.map((item) => {
      var properties = Object.getOwnPropertyNames(item)
      t.deepEqual(properties, expectedProperties, `Each item should have the same properties as the ${modelName} model`)
    })

    t.end()
  })
})

test('Should return proper response format when request is made to call endpoint', t => {
  const modelName = 'call'
  const expectedProperties = [
    'id',
    'sid',
    'dateCreated',
    'to',
    'from',
    'fromFormatted',
    'phoneNumberSid',
    'priceUnit',
    'direction',
    'apiVersion',
    'uri',
    'subresourceUris']

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    body.calls.map((call) => {
      // Check if call has required and auto generated properties
      expectedProperties.map((prop) => {
        t.ok(call.hasOwnProperty(prop), `Each item should have the same properties as the ${modelName} model`)
      })
    })

    t.end()
  })
})

test('Should return proper response format when request is made to address endpoint', t => {
  const modelName = 'address'
  const expectedProperties = ['id',
    'sid',
    'customerName',
    'street',
    'city',
    'region',
    'postalCode',
    'isoCountry']

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')

    body.addresses.map((address) => {
      expectedProperties.map((prop) => {
        t.ok(address.hasOwnProperty(prop), `Each item should have the same properties as the ${modelName} model`)
      })
    })

    t.end()
  })
})

test('Should return result in proper format', t => {
  const modelName = 'recording'

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(typeof body.recordings, 'object')

    t.end()
  })
})

test('Should return NON empty result', t => {
  const modelName = 'call'

  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(typeof body.calls, 'object')
    t.ok(body.calls.length > 0)

    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  SERVER.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
