const test = require('tap').test
const request = require('request')
const port = 8080
const baseUrl = `http://localhost:${port}`
const apiPrefix = '/api'
const urlToHit = `${baseUrl}${apiPrefix}`
const server = require('../server/factory')

var SERVER
const AUTH = {}
test('### START SERVER ###', function (t) {
  server.startHTTPArrow({}, arrow => {
    t.ok(arrow, 'Arrow has been started')
    SERVER = arrow

    t.ok(SERVER.config.apikey, 'apikey is set')
    AUTH.user = SERVER.config.apikey

    t.end()
  })
})

test('Should return proper status code when valid request is passed', t => {
  const id = 'SM998f7c270098420b82fd7c2c32fe2832'
  const modelName = 'message'
  const uri = `${urlToHit}/${modelName}`
  const options = {
    uri: `${uri}/${id}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'statusCode should be 200')
    t.end()
  })
})

test('Should return proper status code when valid request is passed to call endpoint', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const id = 'CA8a3f92d936e485725f08b67a37bbcf89'
  const options = {
    uri: `${uri}/${id}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(body.calls[0].status, 'busy')
    t.equal(body.calls[0].price_unit, 'USD')
    t.equal(body.calls[0].duration, '0')
    t.end()
  })
})

test('Should return proper response when correct ID is passed to message endpoint', t => {
  const modelName = 'message'
  const uri = `${urlToHit}/${modelName}`
  const id = 'SM998f7c270098420b82fd7c2c32fe2832'
  const options = {
    uri: `${uri}/${id}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    const message = body.messages[0]
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(message.sid, id)
    t.equal(message.status, 'delivered')
    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  SERVER.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
