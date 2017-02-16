const test = require('tap').test
const request = require('request')
const config = require('../server/config.js')
const nock = require('nock')
const port = config.port || 8080
const baseUrl = `http://localhost:${port}`
const apiPrefix = '/api'
const urlToHit = `${baseUrl}${apiPrefix}`
const auth = {
  user: config.apikey_development,
  password: ''
}

var SERVER
const serverFactory = require('../server/factory')
test('### START SERVER ###', function (t) {
  if (!config.mockAPI) {
    serverFactory(config, arrow => {
      t.ok(arrow, 'Arrow has been started')
      SERVER = arrow
      t.end()
    })
  } else {
    t.pass('Arrow is skipped ... working with mock server')
    t.end()
  }
})

test('Should return proper status code when valid request is passed', t => {
  const id = 'SM998f7c270098420b82fd7c2c32fe2832'
  const modelName = 'message'
  const uri = `${urlToHit}/${modelName}`
  const options = {
    uri: `${uri}/${id}`,
    method: 'GET',
    auth: auth,
    json: true
  }

  if (config.mockAPI) {
    nock(urlToHit)
      .get(`/${modelName}/${id}`)
      .reply(200, { success: true })
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'statusCode should be 200')
    nock.cleanAll()
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
    auth: auth,
    json: true
  }

  if (config.mockAPI) {
    nock(urlToHit)
      .get(`/${modelName}/${id}`)
      .reply(200, {
        success: true,
        call: {
          status: 'busy',
          price_unit: 'USD',
          duration: '0'
        }
      })
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err)
    t.ok(body.success)
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(body.call.status, 'busy')
    t.equal(body.call.price_unit, 'USD')
    t.equal(body.call.duration, '0')
    nock.cleanAll()
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
    auth: auth,
    json: true
  }

  if (config.mockAPI) {
    nock(urlToHit)
      .get(`/${modelName}/${id}`)
      .reply(200, {
        success: true,
        message: {
          sid: id,
          status: 'delivered'
        }
      })
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    const message = body.message
    t.ok(body.success, 'Body success should be true')
    t.equal(response.statusCode, 200, 'status code should be 200')
    t.equal(message.sid, id)
    t.equal(message.status, 'delivered')
    nock.cleanAll()
    t.end()
  })
})

test('Should return proper response when INVALID ID is passed', t => {
  const modelName = 'message'
  const uri = `${urlToHit}/${modelName}`
  const id = 3
  const options = {
    uri: `${uri}/${id}`,
    method: 'GET',
    auth: auth,
    json: true
  }

  if (config.mockAPI) {
    nock(urlToHit)
      .get(`/${modelName}/${id}`)
      .reply(500, {
        success: false,
        message: `Could not find ${modelName} with ID: ${id}`
      })
  }

  request(options, function (err, response, body) {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(body.success, 'Body success should be false')
    t.equal(response.statusCode, 500)
    t.equal(body.message, `Could not find ${modelName} with ID: ${id}`)
    nock.cleanAll()
    t.end()
  })
})

test('### STOP SERVER ###', function (t) {
  if (!config.mockAPI) {
    SERVER.stop(function () {
      t.pass('Arrow has been stopped!')
      t.end()
    })
  } else {
    t.end()
  }
})
