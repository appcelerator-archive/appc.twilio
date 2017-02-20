// const test = require('tap').test
// const request = require('request')
// const port = 8080
// const baseUrl = `http://localhost:${port}`
// const apiPrefix = '/api'
// const urlToHit = `${baseUrl}${apiPrefix}`
// const server = require('../server/factory')

// var SERVER
// var ID
// const AUTH = {}
// test('### START SERVER ###', function (t) {
//   server.startHTTPArrow({}, arrow => {
//     t.ok(arrow, 'Arrow has been started')
//     SERVER = arrow

//     t.ok(SERVER.config.apikey, 'apikey is set')
//     AUTH.user = SERVER.config.apikey

//     t.end()
//   })
// })

// test('Should get last call id to delete it', t => {
//   const modelName = '/call'
//   const uri = `${urlToHit}${modelName}`
//   const options = {
//     uri: uri,
//     method: 'GET',
//     auth: AUTH,
//     json: true
//   }

//   request(options, function (err, response, body) {
//     if (err) {
//       t.error(err)
//       t.end()
//     }
//     ID = body.calls[1].sid
//     t.ok(body.success)
//     t.end()
//   })
// })

// test('Should delete a call if required parameters are passed', t => {
//   const modelName = 'call'
//   const uri = `${urlToHit}/${modelName}/${ID}`
//   const options = {
//     uri: uri,
//     method: 'DELETE',
//     auth: AUTH,
//     json: true
//   }

//   request(options, function (err, response, body) {
//     if (err) {
//       t.error(err)
//       t.end()
//     }
//     t.equal(response.statusCode, 204, 'status code should be 204 deleted')
//     t.end()
//   })
// })

// test('Should get last message id to delete it', t => {
//   const modelName = '/message'

//   const uri = `${urlToHit}${modelName}`
//   const options = {
//     uri: uri,
//     method: 'GET',
//     auth: AUTH,
//     json: true
//   }

//   request(options, function (err, response, body) {
//     if (err) {
//       t.error(err)
//       t.end()
//     }
//     ID = body.messages[1].sid
//     t.ok(body.success)
//     t.end()
//   })
// })

// test('Should delete a message if required parameters are passed', t => {
//   const modelName = 'message'
//   const uri = `${urlToHit}/${modelName}/${ID}`
//   const options = {
//     uri: uri,
//     method: 'DELETE',
//     auth: AUTH,
//     json: true
//   }

//   request(options, function (err, response, body) {
//     if (err) {
//       t.error(err)
//       t.end()
//     }
//     t.equal(response.statusCode, 204, 'status code should be 204 deleted')

//     t.end()
//   })
// })

// test('Should NOT delete if id param is not valid', t => {
//   const modelName = 'message'
//   ID = 'invalid'
//   const uri = `${urlToHit}/${modelName}/${ID}`
//   const options = {
//     uri: uri,
//     method: 'DELETE',
//     auth: AUTH,
//     json: true
//   }

//   request(options, function (err, response, body) {
//     if (err) {
//       t.error(err)
//       t.end()
//     }
//     t.equal(response.statusCode, 500, 'status code should be 500 not found')
//     t.equal(body.success, false)
//     t.end()
//   })
// })

// test('### STOP SERVER ###', function (t) {
//   SERVER.stop(function () {
//     t.pass('Arrow has been stopped!')
//     t.end()
//   })
// })
