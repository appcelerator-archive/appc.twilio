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

test('Should go through with auth alright', t => {
  const modelName = '/call'
  const uri = `${urlToHit}${modelName}`
  const options = {
    uri: uri,
    method: 'GET',
    auth: AUTH,
    json: true
  }
  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.end()
  })
})

test('Should fail with wrong auth params', t => {
  const modelName = '/call'
  const uri = `${urlToHit}${modelName}`
  const options = {
    uri: uri,
    method: 'GET',
    auth: {
      user: 'John',
      password: 'Invalid'
    },
    json: true
  }
  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.equal(response.statusCode, 401, 'status code should be 401')
    t.equal(body.message, 'Unauthorized')
    t.notOk(body.success, 'With wrong auth body succes should be false')

    t.end()
  })
})

test('Should make sure auth is required', t => {
  const modelName = '/call'
  const uri = `${urlToHit}${modelName}`
  const options = {
    uri: uri,
    method: 'GET',
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
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
