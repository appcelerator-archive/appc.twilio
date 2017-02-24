const test = require('tap').test
const { server } = require('../utils/server').startPlainArrow()
const config = server.config.connectors['appc.twilio']
const configNumber = config.twilio_number
const sinon = require('sinon')
const sdkFacade = require('./../../utils/sdkFacade')(config)
const transformer = require('./../../utils/transformer')
const twilioAPI = require('./../../utils/twilioAPI')(config, sdkFacade, transformer)

function cb (errorMessage, data) { }
const cbSpy = sinon.spy(cb)
const errorMessage = new Error()
const dataFromTwilio = 'DATA_FROM_TWILIO'
const transformToCollectionStub = sinon.stub(
  transformer,
  'transformToCollection',
  (data) => {
    return dataFromTwilio
  }
)
const transformToModelStub = sinon.stub(
  transformer,
  'transformToModel',
  (data) => {
    return dataFromTwilio
  }
)

// var messageId
// var addressId
// var queueId
// var outgoingCallerId

test('### createCall - Success ###', function (t) {
  const model = server.getModel('call')
  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createCall',
    (options, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.createCall(model, config.outgoing_caller_data, configNumber, cbSpy)

  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### createCall - Error ###', function (t) {
  const model = server.getModel('call')
  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createCall',
    (payload, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.createCall(model, config.outgoing_caller_data, configNumber, cbSpy)

  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))
  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createMessage - Success ###', function (t) {
  const model = server.getModel('message')
  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createMessage',
    (payload, callback) => {
      callback(null, dataFromTwilio)
    }
  )
  const smsValues = {
    to: config.outgoing_caller_data,
    body: 'trial'
  }

  twilioAPI.createMessage(model, smsValues, configNumber, cbSpy)

  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### createMessage - Error ###', function (t) {
  const model = server.getModel('message')
  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createMessage',
    (payload, callback) => {
      callback(errorMessage)
    }
  )
  const smsValues = {
    to: config.outgoing_caller_data,
    body: 'trial'
  }

  twilioAPI.createMessage(model, smsValues, configNumber, cbSpy)

  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### findAll - Success ###', function (t) {
  const model = server.getModel('message')
  const twilioSDKStub = sinon.stub(
    sdkFacade.find,
    'all',
    (model, callback) => {
      callback(null, dataFromTwilio)
    }
  )
  twilioAPI.find.all(model, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToCollectionStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToCollectionStub.reset()
  cbSpy.reset()

  t.end()
})

test('### findAll - Error ###', function (t) {
  const model = server.getModel('message')

  // TODO stub the transformer as well
  const twilioSDKStub = sinon.stub(
    sdkFacade.find,
    'all',
    (model, callback) => {
      callback(errorMessage)
    }
  )
  twilioAPI.find.all(model, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### findByID Success ###', function (t) {
  const model = server.getModel('message')
  const messageId = 'SMed58f4e57f0b4bafb575654d09b7cb85'
  const twilioSDKStub = sinon.stub(
    sdkFacade.find,
    'byId',
    (model, id, callback) => {
      callback(null, dataFromTwilio)
    }
  )
  twilioAPI.find.byId(model, messageId, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToCollectionStub.reset()
  cbSpy.reset()

  t.end()
})

test('### findByID - Error ###', function (t) {
  const model = server.getModel('message')
  const messageId = 'SMed58f4e57f0b4bafb575654d09b7cb85'
  const twilioSDKStub = sinon.stub(
    sdkFacade.find,
    'byId',
    (model, id, callback) => {
      callback(errorMessage)
    }
  )
  twilioAPI.find.byId(model, messageId, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  transformToCollectionStub.reset()
  cbSpy.reset()

  t.end()
})

// test('### query ###', function (t) {
//   const model = server.getModel('call')

//   const options = {
//     where: { 'status': 'busy' }
//   }

//   twilioAPI.query(model, options, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     t.ok(resp instanceof Array, 'query for multiple objects')
//     t.end()
//   })
// })

// test('### createAddress ####', function (t) {
//   const model = server.getModel('address')
//   const address = {
//     street: '2 Hasselhoff Lane',
//     customerName: 'Joe Doe',
//     city: 'NYC',
//     region: 'Unknown',
//     postalCode: 10013,
//     isoCountry: 'US'
//   }

//   const values = config.mockAPI ? mockedData.address : address

//   twilioAPI.createAddress(model, values, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     t.ok(resp.sid, 'SID has been assigned')
//     addressId = resp.sid
//     t.equal(resp.customerName, values.customerName, 'Customer name is correct')
//     t.end()
//   })
// })

// test('### updateAddress ###', function (t) {
//   const model = server.getModel('address')

//   const doc = {
//     customerName: 'Changed customer'
//   }

//   twilioAPI.updateAddress(model, addressId, doc, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     twilioAPI.find.byId(model, addressId, (err, resp) => {
//       if (err) {
//         t.error(err)
//         t.end()
//       }
//       t.ok(resp, 'updated record found')
//       t.ok(resp.customerName === doc.customerName, 'record updated successfully')
//       t.end()
//     })
//   })
// })

// #########  REAL JUNK

// test('### deleteById ###', function (t) {
//   const model = server.getModel('address')

//   twilioAPI.deleteById(model, addressId, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     twilioAPI.find.byId(model, addressId, (err, resp) => {
//       t.ok(err, 'deleted successfully')
//       t.end()
//     })
//   })
// })

// test('### createQueue ###', function (t) {
//   const model = server.getModel('queue')

//   const values = config.mockAPI ? mockedData.queue : {
//     friendlyName: `Queue_${Math.floor(Math.random() * 100000)}`
//   }

//   twilioAPI.createQueue(model, values, configNumber, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     t.ok(resp.sid, 'SID has been assigned')
//     queueId = resp.sid
//     t.end()
//   })
// })

// test('### updateQueue ###', function (t) {
//   const model = server.getModel('queue')
//   const doc = {
//     maxSize: 120,
//     friendlyName: `Queue_${Math.floor(Math.random() * 100000)}`
//   }
//   twilioAPI.updateQueue(model, queueId, doc, (err, resp) => {
//     if (err) {
//       t.error(err)
//       t.end()
//     }
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     twilioAPI.find.byId(model, queueId, (err, resp) => {
//       if (err) {
//         t.error(err)
//         t.end()
//       }
//       t.ok(resp, 'found queue')
//       t.ok(resp.maxSize === doc.maxSize, 'queue updated successfully')
//       t.end()
//     })
//   })
// })

// creating outgoingCallerId requires code validation
// test.skip('### createOutgoingCallerId ###', function (t) {
//   const model = server.getModel('outgoingCallerId')

//   var values = {
//     friendlyName: '359',
//     phone_number: config.caller_number
//   }

//   twilioAPI.createOutgoingCallerId(model, values, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     id = resp.sid
//     t.end()
//   })
// })

// test('### updateOutgoingCallerId ###', function (t) {
//   const model = server.getModel('outgoingCallerId')

//   const doc = 'User'

//   twilioAPI.find.all(model, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     t.ok(resp[0].sid, 'SID has been assigned')
//     id = resp[0].sid

//     twilioAPI.updateOutgoingCallerId(model, id, doc, (err, resp) => {
//       twilioAPI.find.byId(model, id, (err, resp) => {
//         t.ok(resp, 'found caller id')
//         t.ok(resp.friendly_name === doc, 'updated successfully')
//         t.end()
//       })
//     })
//   })
// })
