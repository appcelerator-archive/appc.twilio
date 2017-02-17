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
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"status": "busy"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')

    t.end()
  })
})

test('Should return only calls with status busy', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"status": "busy"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code')

    body.calls.map((call) => {
      t.equal(call.status, 'busy', 'call status should be busy')
    })

    t.end()
  })
})

test('Should return proper response based on query parameters', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"status": "completed", "to": "359899638562"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'call status should be 200')

    body.calls.map((call) => {
      t.equal(call.status, 'completed', 'call status should be completed')
      t.equal(call.to, '+359899638562', 'incoming call number should be +359899638562')
    })

    t.end()
  })
})

test('Should return NO response if there is no call to a given number', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"to": "359271825"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(body.calls.length, 0, 'there should be no calls to this number')

    t.end()
  })
})

test('Should return return all calls on the date passed in the query parameters', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"startTime": "2017-01-31"}'
  const expectedCallTime = '31 Jan 2017'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200)
    t.equal(typeof body.calls, 'object')

    body.calls.map((call) => {
      // If start time is correct should be true
      t.ok(call.start_time.indexOf(expectedCallTime) !== -1)
    })

    t.end()
  })
})

test('Should return return all messages to a given number', t => {
  const modelName = 'message'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"to": "359899982932"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(typeof body.messages, 'object')

    body.messages.map((message) => {
      t.equal(message.to, '+359899982932')
    })

    t.end()
  })
})

test('Should return return all messages to a given number and date', t => {
  const modelName = 'message'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"to": "359899982932", "DateSent": "Thu, 26 Jan 2017"}'
  const expectedMessageDate = 'Thu, 26 Jan 2017'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(typeof body.messages, 'object')

    body.messages.map((message) => {
      t.equal(message.to, '+359899982932', 'there nust be only messages to +359899982932')
      t.ok(message.date_sent.indexOf(expectedMessageDate) !== -1, `Date sent should be ${expectedMessageDate}`)
    })

    t.end()
  })
})

test('Should return return all if no query parameters are passed', t => {
  const modelName = 'call'
  const uri = `${urlToHit}/${modelName}`
  const options = {
    uri: `${uri}/query?`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(typeof body.calls, 'object')

    t.end()
  })
})

test('Should return all addresses with friendly name "The Simpsons" ', t => {
  const modelName = 'address'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"friendlyName": "The Simpsons"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')

    body.addresses.map((address) => {
      t.equal(address.friendlyName, 'The Simpsons')
    })

    t.end()
  })
})

test('Should return NO address when there is no such address based on the query parameters', t => {
  const modelName = 'address'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"friendlyName": "The Simpsons", "customerName": "Homer"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(body.addresses.length, 0, 'body length should be 0')

    t.end()
  })
})

test('Should return return NO results if there is no outgoing caller id with this phone number', t => {
  const modelName = 'outgoingCallerId'
  const uri = `${urlToHit}/${modelName}`
  const where = '{"phoneNumber": "16467625508"}'
  const options = {
    uri: `${uri}/query?where=${where}`,
    method: 'GET',
    auth: AUTH,
    json: true
  }

  request(options, function (err, response, body) {
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(body.outgoingcallerids.length, 0)

    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  SERVER.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
