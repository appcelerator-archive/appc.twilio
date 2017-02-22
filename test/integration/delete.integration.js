const test = require('tap').test
const server = require('../utils/server')
const requester = require('../utils/requester')

var SERVER
var REQUESTER
var ID

test('### START SERVER ###', function (t) {
  server.startHTTPArrow({}, arrow => {
    t.ok(arrow, 'Arrow has been started')
    SERVER = arrow
    REQUESTER = requester(SERVER.config)
    t.end()
  })
})

test('Should get last call id to delete it', t => {
  const modelName = 'call'

  REQUESTER.getData({ model: modelName }, (response, body) => {
    ID = body.calls[1].sid
    t.ok(body.success)
    t.end()
  })
})

test('Should delete a call if required parameters are passed', t => {
  const modelName = 'call'

  REQUESTER.deleteData({ model: modelName, id: ID }, (response, body) => {
    t.equal(response.statusCode, 204, 'status code should be 204 deleted')
    t.end()
  })
})

test('Should get last message id to delete it', t => {
  const modelName = 'message'

  REQUESTER.getData({ model: modelName }, (response, body) => {
    ID = body.messages[1].sid
    t.ok(body.success)
    t.end()
  })
})

test('Should delete a message if required parameters are passed', t => {
  const modelName = 'message'

  REQUESTER.deleteData({ model: modelName, id: ID }, (response, body) => {
    t.equal(response.statusCode, 204, 'status code should be 204 deleted')

    t.end()
  })
})

test('Should NOT delete if id param is not valid', t => {
  const modelName = 'message'
  ID = 'invalid'

  REQUESTER.deleteData({ model: modelName, id: ID }, (response, body) => {
    t.equal(response.statusCode, 500, 'status code should be 500 not found')
    t.equal(body.success, false)
    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  SERVER.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
