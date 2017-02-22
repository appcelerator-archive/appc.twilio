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

test('Should create a call if required parameters are passed', t => {
  const modelName = 'call'
  const body = {
    to: '+359899638562'
  }

  REQUESTER.postData({ model: modelName, body: body }, (response, body) => {
    t.equal(response.statusCode, 201, 'status code should be 201 created')
    t.end()
  })
})

test('Should NOT create a call if required parameters are not passed', t => {
  const modelName = 'call'

  REQUESTER.postData({ model: modelName }, (response, body) => {
    t.notOk(body.success, 'Body success should be false')
    t.equal(response.statusCode, 400, 'status code should be 400')
    t.end()
  })
})

test('Should create a message if required parameters are passed', t => {
  const modelName = 'message'
  const body = {
    to: '+359899638562',
    body: 'Hi there !'
  }

  REQUESTER.postData({ model: modelName, body: body }, (response, body) => {
    const reqBody = JSON.parse(response.request.body)

    t.equal(response.statusCode, 201, 'status code should be 201')
    t.equal(reqBody.to, '+359899638562')
    t.equal(reqBody.body, 'Hi there !')
    t.end()
  })
})

test('Should create an address if required parameters are passed', t => {
  const modelName = 'address'
  const body = {
    friendlyName: 'Test Address',
    customerName: 'Test',
    street: 'Some beautiful street',
    city: 'Racoon City',
    region: 'CA',
    postalCode: '12345',
    isoCountry: 'US'
  }

  REQUESTER.postData({ model: modelName, body: body }, (response, body) => {
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
