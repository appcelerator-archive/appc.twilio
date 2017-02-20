const test = require('tap').test
const request = require('request')
const port = 8080
const baseUrl = `http://localhost:${port}`
const apiPrefix = '/api'
const urlToHit = `${baseUrl}${apiPrefix}`
const server = require('../utils/server')

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

test('Should create a call if required parameters are passed', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const options = {
    uri: uri,
    method: 'POST',
    body: {
      to: '+359899638562'
    },
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.equal(response.statusCode, 201, 'status code should be 201 created')
    t.end()
  })
})

test('Should NOT create a call if required parameters are not passed', t => {
  const modelName = '/call'
  const uri = `${urlToHit}${modelName}`
  const options = {
    uri: uri,
    method: 'POST',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(body.success, 'Body success should be false')
    t.equal(response.statusCode, 400, 'status code should be 400')
    t.end()
  })
})

test('Should create a message if required parameters are passed', t => {
  const modelName = '/message'
  const uri = `${urlToHit}${modelName}`
  const options = {
    uri: uri,
    method: 'POST',
    body: {
      to: '+359899638562',
      body: 'Hi there !'
    },
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    const reqBody = JSON.parse(response.request.body)

    t.equal(response.statusCode, 201, 'status code should be 201')
    t.equal(reqBody.to, '+359899638562')
    t.equal(reqBody.body, 'Hi there !')
    t.end()
  })
})

test('Should create an address if required parameters are passed', t => {
  const modelName = '/address'
  const uri = `${urlToHit}${modelName}`
  const options = {
    uri: uri,
    method: 'POST',
    body: {
      friendlyName: 'Test Address',
      customerName: 'Test',
      street: 'Some beautiful street',
      city: 'Racoon City',
      region: 'CA',
      postalCode: '12345',
      isoCountry: 'US'
    },
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    const reqBody = JSON.parse(response.request.body)

    t.equal(response.statusCode, 201, 'status code should be 201')
    t.equal(reqBody.customerName, 'Test')
    t.equal(reqBody.region, 'CA')

    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  SERVER.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
