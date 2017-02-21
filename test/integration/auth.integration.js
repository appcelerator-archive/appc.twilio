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

test('Should go through with auth alright', t => {
  const modelName = '/call'
  REQUESTER.getData({ model: modelName }, (response, body) => {
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.end()
  })
})

test('Should fail with wrong auth params', t => {
  const modelName = '/call'
  const auth = {
    user: 'John',
    password: 'Invalid'
  }
  REQUESTER.getData({ model: modelName, auth: auth }, (response, body) => {
    t.equal(response.statusCode, 401, 'status code should be 401')
    t.equal(body.message, 'Unauthorized')
    t.notOk(body.success, 'With wrong auth body succes should be false')
    t.end()
  })
})

test('Should make sure auth is required', t => {
  const modelName = '/call'
  REQUESTER.getData({ model: modelName, skipAuth: true }, (response, body) => {
    t.equal(response.statusCode, 401, 'status code should be 401')
    t.equal(body.message, 'Unauthorized')
    t.notOk(body.success, 'With wrong auth body succes should be false')
    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  SERVER.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
