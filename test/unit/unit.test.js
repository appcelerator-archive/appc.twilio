const tap = require('tap')
const test = tap.test
const Arrow = require('arrow')
const def = require('../../conf/default')
const config = def.connectors['appc.twilio']
const twilioSDK = require('./../../lib/utils/twilioAPI')(config)
const configNumber = config.twilio_number

var server
var id

test('### Start Arrow ###', function (t) {
  startArrow(function () {
    t.ok(server, 'Arrow has been started')
    t.end()
  })
})

test('### createCall ###', function (t) {
  const model = server.getModel('call')

  const callValues = {
    to: '+359899638562'
  }

  twilioSDK.createCall(model, callValues, configNumber, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'call sid found')
    t.ok(resp.to === callValues.to, 'calling target correct')
    t.end()
  })
})

test('### createMessage ###', function (t) {
  const model = server.getModel('message')

  const smsValues = {
    to: '+359899638562',
    body: 'trial'
  }

  twilioSDK.createMessage(model, smsValues, configNumber, (err, resp) => {
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    id = resp.sid
    t.ok(resp.to === smsValues.to, 'SMS receiver is correct')
    t.end()
  })
})

test('### findAll ###', function (t) {
  const model = server.getModel('message')

  twilioSDK.find.all(model, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp instanceof Array, 'findAll response type is correct')
    t.end()
  })
})

test('### findByID ###', function (t) {
  const model = server.getModel('message')

  twilioSDK.find.byId(model, id, (err, resp) => {
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid === id, 'found correct message')
    t.equal(resp.status, 'sent')
    t.end()
  })
})

test('### query ###', function (t) {
  const model = server.getModel('call')

  var options = {
    where: { 'status': 'failed' }
  }

  twilioSDK.query(model, options, (err, resp) => {
    t.notok(err, 'should not display error')
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

  twilioSDK.createAddress(model, values, (err, resp) => {
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    id = resp.sid
    t.ok(resp.customerName === values.customerName, 'Customer name is correct')
    t.end()
  })
})

test('### updateAddress ###', function (t) {
  const model = server.getModel('address')

  var doc = {
    CustomerName: 'Changed customer'
  }

  twilioSDK.updateAddress(model, id, doc, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    twilioSDK.find.byId(model, id, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      t.ok(resp, 'updated record found')
      t.ok(resp.customerName === doc.CustomerName, 'record updated successfully')
      t.end()
    })
  })
})

test('### deleteById ###', function (t) {
  const model = server.getModel('address')

  twilioSDK.deleteById(model, id, (err, resp) => {
    t.notok(err, 'should not display error')
    twilioSDK.find.byId(model, id, (err, resp) => {
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

  twilioSDK.createQueue(model, values, configNumber, (err, resp) => {
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp.sid, 'SID has been assigned')
    id = resp.sid
    t.end()
  })
})

test('### updateQueue ###', function (t) {
  const model = server.getModel('queue')

  const doc = 120

  twilioSDK.updateQueue(model, id, doc, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notOk(err, 'should not display error')
    t.ok(resp, 'should receive response')
    twilioSDK.find.byId(model, id, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      t.ok(resp, 'found queue')
      t.ok(resp.max_size === doc, 'queue updated successfully')
      t.end()
    })
  })
})

// creating outgoingCallerId requires code validation

test.skip('### createOutgoingCallerId ###', function (t) {
  const model = server.getModel('outgoingCallerId')

  var values = {
    friendlyName: '359',
    phone_number: '+3598999829322'
  }

  twilioSDK.createOutgoingCallerId(model, values, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    id = resp.sid
    t.end()
  })
})

test('### updateOutgoingCallerId ###', function (t) {
  const model = server.getModel('outgoingCallerId')

  const doc = 'User'

  twilioSDK.find.all(model, (err, resp) => {
    if (err) {
      t.error(err)
      t.end()
    }
    t.notok(err, 'should not display error')
    t.ok(resp, 'should receive response')
    t.ok(resp[0].sid, 'SID has been assigned')
    id = resp[0].sid

    twilioSDK.updateOutgoingCallerId(model, id, doc, (err, resp) => {
      if (err) {
        t.error(err)
        t.end()
      }
      twilioSDK.find.byId(model, id, (err, resp) => {
        if (err) {
          t.error(err)
          t.end()
        }
        t.ok(resp, 'found caller id')
        t.ok(resp.friendly_name === doc, 'updated successfully')
        t.end()
      })
    })
  })
})

test('### STOP SERVER ###', function (t) {
  server.stop(function () {
    t.pass('Server has been stopped!')
    t.end()
  })
})

function startArrow (callback) {
  server = new Arrow({
    port: (Math.random() * 40000 + 1200) | 0
  })
  server.start(callback)
}
