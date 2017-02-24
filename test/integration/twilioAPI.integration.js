const test = require('tap').test
const { server } = require('../utils/server').startPlainArrow()
const config = server.config.connectors['appc.twilio']
const configNumber = config.twilio_number
const outgoingCallerData = config.outgoing_caller_data
const sdkFacade = require('./../../utils/sdkFacade')(config)
const transformer = require('./../../utils/transformer')
const twilioAPI = require('./../../utils/twilioAPI')(config, sdkFacade, transformer)

var messageId
var addressId
var queueId

test('### createCall ###', function (t) {
  const model = server.getModel('call')

  twilioAPI.createCall(model, outgoingCallerData, configNumber, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'call sid found')
    t.ok(resp.to === outgoingCallerData.to, 'calling target correct')
    t.end()
  })
})

test('### createMessage ###', function (t) {
  const model = server.getModel('message')

  const smsValues = {
    to: outgoingCallerData.to,
    body: 'trial'
  }

  twilioAPI.createMessage(model, smsValues, configNumber, (err, resp) => {
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

  twilioAPI.find.all(model, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp instanceof Array, 'findAll response type is correct')
    t.ok(resp.length > 0, 'should return more than one element')
    t.end()
  })
})

test('### findByID ###', function (t) {
  const model = server.getModel('message')

  twilioAPI.find.byId(model, messageId, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid === messageId, 'found correct message')
    t.ok(resp.status, 'status has been set')
    t.end()
  })
})

test('### query ###', function (t) {
  const model = server.getModel('call')

  const options = {
    where: { 'status': 'busy' }
  }

  twilioAPI.query(model, options, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp instanceof Array, 'query for multiple objects')
    t.end()
  })
})

test('### createAddress ####', function (t) {
  const model = server.getModel('address')
  const address = {
    street: '2 Hasselhoff Lane',
    customerName: 'Joe Doe',
    city: 'NYC',
    region: 'Unknown',
    postalCode: 10013,
    isoCountry: 'US'
  }

  twilioAPI.createAddress(model, address, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    addressId = resp.sid
    t.equal(resp.customerName, address.customerName, 'Customer name is correct')
    t.end()
  })
})

test('### updateAddress ###', function (t) {
  const model = server.getModel('address')

  const doc = {
    customerName: 'Changed customer'
  }

  twilioAPI.updateAddress(model, addressId, doc, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    twilioAPI.find.byId(model, addressId, (err, resp) => {
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

  twilioAPI.deleteById(model, addressId, (err, resp) => {
    t.notOk(err, 'should not display error')
    twilioAPI.find.byId(model, addressId, (err, resp) => {
      t.ok(err, 'deleted successfully')
      t.end()
    })
  })
})

test('### createQueue ###', function (t) {
  const model = server.getModel('queue')

  const values = {
    friendlyName: `Queue_${Math.floor(Math.random() * 100000)}`
  }

  twilioAPI.createQueue(model, values, configNumber, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    queueId = resp.sid
    t.end()
  })
})

test('### updateQueue ###', function (t) {
  const model = server.getModel('queue')
  const doc = {
    maxSize: 120,
    friendlyName: `Queue_${Math.floor(Math.random() * 100000)}`
  }
  twilioAPI.updateQueue(model, queueId, doc, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    twilioAPI.find.byId(model, queueId, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      t.ok(resp, 'found queue')
      t.ok(resp.maxSize === doc.maxSize, 'queue updated successfully')
      t.end()
    })
  })
})

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
