const test = require('tap').test
const local = require('../../conf/local')
const config = local.connectors['appc.twilio']
const twilioSDK = require('./../../utils/twilioAPI')(config)
const mockedSDK = require('../mocks/twilioAPIMock')(config)
const configNumber = config.twilio_number
const mockedData = require('../mocks/data/test.unit')
const { server } = require('../server/factory').startPlainArrow()

var messageId
var addressId
var queueId
// var outgoingCallerId

test('### createCall ###', function (t) {
  const model = server.getModel('call')

  const callValues = {
    to: '+359899982932'
  }

  if (config.mockAPI) {
    mockedSDK.createCall(model, mockedData.call, configNumber, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp.sid, 'call sid found')
      t.ok(resp.to === callValues.to, 'calling target correct')
      t.end()
    })
  }

  twilioSDK.createCall(model, callValues, configNumber, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'call sid found')
    t.ok(resp.to === callValues.to, 'calling target correct')
    t.end()
  })
})

test('### createMessage ###', function (t) {
  const model = server.getModel('message')

  const smsValues = {
    to: '+359899982932',
    body: 'trial'
  }

  if (config.mockAPI) {
    mockedSDK.createMessage(model, mockedData.message, configNumber, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp.sid, 'SID has been assigned')
      messageId = resp.sid
      t.ok(resp.to === smsValues.to, 'SMS receiver is correct')
      t.end()
    })
  }

  twilioSDK.createMessage(model, smsValues, configNumber, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    messageId = resp.sid
    t.ok(resp.to === smsValues.to, 'SMS receiver is correct')
    t.end()
  })
})

test('### findAll ###', function (t) {
  const model = server.getModel('message')

  if (config.mockAPI) {
    mockedSDK.find.all(model, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp instanceof Array, 'findAll response type is correct')
      t.ok(resp.length > 0, 'should return more than one element')
      t.end()
    })
  }

  twilioSDK.find.all(model, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp instanceof Array, 'findAll response type is correct')
    t.ok(resp.length > 0, 'should return more than one element')
    t.end()
  })
})

test('### findByID ###', function (t) {
  const model = server.getModel('message')

  if (config.mockAPI) {
    mockedSDK.find.byId(model, messageId, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp.sid === messageId, 'found correct message')
      t.ok(resp.status, 'status has been set')
      t.end()
    })
  }

  twilioSDK.find.byId(model, messageId, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid === messageId, 'found correct message')
    t.ok(resp.status, 'status has been set')
    t.end()
  })
})

test('### query ###', function (t) {
  const model = server.getModel('call')

  var options = {
    where: { 'status': 'failed' }
  }

  if (config.mockAPI) {
    mockedSDK.query(model, options, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp instanceof Array, 'query for multiple objects')
      t.end()
    })
  }

  twilioSDK.query(model, options, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp instanceof Array, 'query for multiple objects')
    t.end()
  })
})

test('### createAddress ####', function (t) {
  const model = server.getModel('address')

  var values = {
    street: '2 Hasselhoff Lane',
    customerName: 'Joe Doe',
    city: 'NYC',
    region: 'Unknown',
    postalCode: 10013,
    isoCountry: 'US'
  }

  if (config.mockAPI) {
    mockedSDK.createAddress(model, mockedData.address, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp.sid, 'SID has been assigned')
      addressId = resp.sid
      t.ok(resp.customerName, values.customerName, 'Customer name is correct')
      t.end()
    })
  }

  twilioSDK.createAddress(model, values, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    addressId = resp.sid
    t.equal(resp.customerName, values.customerName, 'Customer name is correct')
    t.end()
  })
})

test('### updateAddress ###', function (t) {
  const model = server.getModel('address')

  var doc = {
    customerName: 'Changed customer'
  }

  twilioSDK.updateAddress(model, addressId, doc, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    twilioSDK.find.byId(model, addressId, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      t.ok(resp, 'updated record found')
      t.ok(resp.customerName === doc.customerName, 'record updated successfully')
      t.end()
    })
  })
})

test('### deleteById ###', function (t) {
  const model = server.getModel('address')

  twilioSDK.deleteById(model, addressId, (err, resp) => {
    t.notOk(err, 'should not display error')
    twilioSDK.find.byId(model, addressId, (err, resp) => {
      t.ok(err, 'deleted successfully')
      t.end()
    })
  })
})

test('### createQueue ###', function (t) {
  const model = server.getModel('queue')

  var values = {
    friendlyName: `Queue_${Math.floor(Math.random() * 100000)}`
  }

  if (config.mockAPI) {
    mockedSDK.createQueue(model, mockedData.queue, configNumber, (err, resp) => {
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      t.ok(resp.sid, 'SID has been assigned')
      queueId = resp.sid
      t.end()
    })
  }

  twilioSDK.createQueue(model, values, configNumber, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    queueId = resp.sid
    t.end()
  })
})

test('### updateQueue ###', function (t) {
  const model = server.getModel('queue')

  const doc = 120

  if (config.mockAPI) {
    mockedSDK.updateQueue(model, queueId, doc, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      mockedSDK.find.byId(model, queueId, (err, resp) => {
        if (err) {
          t.error(err)
          t.end()
        }
        t.ok(resp, 'found queue')
        t.ok(resp.max_size === doc, 'queue updated successfully')
        t.end()
      })
    })

    twilioSDK.updateQueue(model, queueId, doc, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      t.notOk(err, 'should not display error')
      t.ok(resp, 'should receive response')
      twilioSDK.find.byId(model, queueId, (err, resp) => {
        if (err) {
          t.error(err)
          t.end()
        }
        t.ok(resp, 'found queue')
        t.ok(resp.max_size === doc, 'queue updated successfully')
        t.end()
      })
    })
  }
})

// creating outgoingCallerId requires code validation
// test.skip('### createOutgoingCallerId ###', function (t) {
//   const model = server.getModel('outgoingCallerId')

//   var values = {
//     friendlyName: '359',
//     phone_number: config.caller_number
//   }

//   twilioSDK.createOutgoingCallerId(model, values, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     id = resp.sid
//     t.end()
//   })
// })

// test('### updateOutgoingCallerId ###', function (t) {
//   const model = server.getModel('outgoingCallerId')

//   const doc = 'User'

//   twilioSDK.find.all(model, (err, resp) => {
//     t.notOk(err, 'should not display error')
//     t.ok(resp, 'should receive response')
//     t.ok(resp[0].sid, 'SID has been assigned')
//     id = resp[0].sid

//     twilioSDK.updateOutgoingCallerId(model, id, doc, (err, resp) => {
//       twilioSDK.find.byId(model, id, (err, resp) => {
//         t.ok(resp, 'found caller id')
//         t.ok(resp.friendly_name === doc, 'updated successfully')
//         t.end()
//       })
//     })
//   })
// })
