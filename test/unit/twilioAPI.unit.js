const test = require('tap').test
const { server } = require('../utils/server').startPlainArrow()
const config = {
  sid: '123456789012345678901234567890112345',
  auth_token: '123456789012345678901234567890112345'
}
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

test('### createCall - Success ###', function (t) {
  const model = server.getModel('call')
  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createCall',
    (options, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.createCall(model, {}, 'configNumber', cbSpy)

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

  twilioAPI.createCall(model, 'numberTo', 'configNumber', cbSpy)

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
    to: 'yourNumber',
    body: 'trial'
  }

  twilioAPI.createMessage(model, smsValues, 'configNumber', cbSpy)

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
    to: 'number',
    body: 'trial'
  }

  twilioAPI.createMessage(model, smsValues, 'configNumber', cbSpy)

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

test('### findByID - Success ###', function (t) {
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
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
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
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createAddress - Success ####', function (t) {
  const model = server.getModel('address')
  const address = {
    street: '2 Hasselhoff Lane',
    customerName: 'Joe Doe',
    city: 'NYC',
    region: 'Unknown',
    postalCode: 10013,
    isoCountry: 'US'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createAddress',
    (payload, callback) => {
      callback(null, dataFromTwilio)
    }
  )
  const values = address

  twilioAPI.createAddress(model, values, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### createAddress - Error ####', function (t) {
  const model = server.getModel('address')
  const address = {
    street: '2 Hasselhoff Lane',
    customerName: 'Joe Doe',
    city: 'NYC',
    region: 'Unknown',
    postalCode: 10013,
    isoCountry: 'US'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createAddress',
    (payload, callback) => {
      callback(errorMessage)
    }
  )
  const values = address

  twilioAPI.createAddress(model, values, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createQueue - Success ####', function (t) {
  const model = server.getModel('queue')
  const queue = {
    friendlyName: '2 Hasselhoff Lane',
    maxSize: 100
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createQueue',
    (payload, callback) => {
      callback(null, dataFromTwilio)
    }
  )
  const values = queue

  twilioAPI.createQueue(model, values, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### createQueue - Error ####', function (t) {
  const model = server.getModel('queue')
  const queue = {
    friendlyName: '2 Hasselhoff Lane',
    maxSize: 100
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createQueue',
    (payload, callback) => {
      callback(errorMessage)
    }
  )
  const values = queue

  twilioAPI.createQueue(model, values, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createAccount - Success ####', function (t) {
  const model = server.getModel('account')
  const account = {
    friendlyName: 'Account'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createAccount',
    (payload, callback) => {
      callback(null, dataFromTwilio)
    }
  )
  const values = account

  twilioAPI.createAccount(model, values, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### createAccount - Error ####', function (t) {
  const model = server.getModel('account')
  const account = {
    friendlyName: 'Account'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'createAccount',
    (payload, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.createAccount(model, account, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### query - Success ####', function (t) {
  const model = server.getModel('call')
  const options = `where={"status": "completed"}`

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'query',
    (model, criteria, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.query(model, options, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToCollectionStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToCollectionStub.reset()
  cbSpy.reset()

  t.end()
})

test('### query - Error ####', function (t) {
  const model = server.getModel('call')
  const options = `where={"status": "completed"}`

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'query',
    (model, criteria, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.query(model, options, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### updateAddress - Success ###', function (t) {
  const model = server.getModel('address')

  const doc = {
    customerName: 'Changed customer'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'updateAddress',
    (id, doc, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.updateAddress(model, '', doc, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### updateAddress - Error ###', function (t) {
  const model = server.getModel('address')

  const doc = {
    customerName: 'Changed customer'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'updateAddress',
    (id, doc, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.updateAddress(model, '', doc, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### updateOutgoingCallerId - Success ###', function (t) {
  const model = server.getModel('outgoingCallerId')

  const doc = {
    customerName: 'Changed customer'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'updateOutgoingCallerId',
    (id, doc, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.updateOutgoingCallerId(model, '', doc, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### updateOutgoingCallerId - Error ###', function (t) {
  const model = server.getModel('outgoingCallerId')

  const doc = {
    customerName: 'Changed customer'
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'updateOutgoingCallerId',
    (id, doc, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.updateOutgoingCallerId(model, '', doc, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### updateQueue - Success ###', function (t) {
  const model = server.getModel('queue')

  const doc = {
    maxSize: 120
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'updateQueue',
    (id, doc, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.updateQueue(model, '', doc, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(transformToModelStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  transformToModelStub.reset()
  cbSpy.reset()

  t.end()
})

test('### updateQueue - Error ###', function (t) {
  const model = server.getModel('queue')

  const doc = {
    maxSize: 120
  }

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'updateQueue',
    (id, doc, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.updateQueue(model, '', doc, cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### deleteById - Success ###', function (t) {
  const model = server.getModel('address')

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'deleteById',
    (model, id, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  twilioAPI.deleteById(model, '', cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})

test('### deleteById - Error ###', function (t) {
  const model = server.getModel('address')

  const twilioSDKStub = sinon.stub(
    sdkFacade,
    'deleteById',
    (model, id, callback) => {
      callback(errorMessage)
    }
  )

  twilioAPI.deleteById(model, '', cbSpy)
  t.ok(twilioSDKStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  twilioSDKStub.restore()
  cbSpy.reset()

  t.end()
})
