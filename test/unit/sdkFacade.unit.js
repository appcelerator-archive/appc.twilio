const test = require('tap').test
const config = {
  sid: '123456789012345678901234567890112345',
  auth_token: '123456789012345678901234567890112345'
}
const sinon = require('sinon')
const sdkFacade = require('../../utils/sdkFacade')(config)
const client = sdkFacade.client
function cb (errorMessage, data) { }
const cbSpy = sinon.spy(cb)
const errorMessage = new Error()
const dataFromTwilio = 'DATA_FROM_TWILIO'

test('### createCall - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'makeCall',
    (options, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  sdkFacade.createCall({ to: '132321', from: '242342' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createCall - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'makeCall',
    (options, callback) => {
      callback(errorMessage)
    }
  )

  sdkFacade.createCall({ to: '132321', from: '242342' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createQueue - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client.queues,
    'create',
    (options, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  sdkFacade.createQueue({ maxSize: '132321', friendlyName: '242342' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createQueue - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client.queues,
    'create',
    (options, callback) => {
      callback(errorMessage)
    }
  )

  sdkFacade.createQueue({ maxSize: '132321', friendlyName: '242342' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createAddress - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client.addresses,
    'create',
    (options, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  sdkFacade.createAddress({ friendlyName: 'name' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createAddress - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client.addresses,
    'create',
    (options, callback) => {
      callback(errorMessage)
    }
  )

  sdkFacade.createAddress({ friendlyName: 'name' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createAccount - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client.accounts,
    'create',
    (options, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  sdkFacade.createAccount({ friendlyName: 'name' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### createAccount - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client.accounts,
    'create',
    (options, callback) => {
      callback(errorMessage)
    }
  )

  sdkFacade.createAccount({ friendlyName: 'name' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### Query - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client.calls,
    'list',
    (criteria, callback) => {
      callback(errorMessage)
    }
  )

  sdkFacade.query('calls', { friendlyName: 'name' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### Query - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client.calls,
    'list',
    (criteria, callback) => {
      callback(null, dataFromTwilio)
    }
  )

  sdkFacade.query('calls', { friendlyName: 'name' }, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateAddress - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'addresses',
    (id) => {
      return {
        post: (payload, callback) => {
          callback(null, dataFromTwilio)
        }
      }
    }
  )

  sdkFacade.updateAddress('id', {}, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateAddress - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'addresses',
    (id) => {
      return {
        post: (payload, callback) => {
          callback(errorMessage)
        }
      }
    }
  )

  sdkFacade.updateAddress('id', {}, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateOutgoingCallerId - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'outgoingCallerIds',
    (id) => {
      return {
        post: (payload, callback) => {
          callback(null, dataFromTwilio)
        }
      }
    }
  )

  sdkFacade.updateOutgoingCallerId('id', {}, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateOutgoingCallerId - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'outgoingCallerIds',
    (id) => {
      return {
        post: (payload, callback) => {
          callback(errorMessage)
        }
      }
    }
  )

  sdkFacade.updateOutgoingCallerId('id', {}, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateQueue - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'queues',
    (id) => {
      return {
        update: (payload, callback) => {
          callback(null, dataFromTwilio)
        }
      }
    }
  )

  sdkFacade.updateQueue('id', {}, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateQueue - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'queues',
    (id) => {
      return {
        update: (payload, callback) => {
          callback(errorMessage)
        }
      }
    }
  )

  sdkFacade.updateQueue('id', {}, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### DeleteById - Success ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'calls',
    (id) => {
      return {
        delete: (callback) => {
          callback(null, dataFromTwilio)
        }
      }
    }
  )

  sdkFacade.deleteById('calls', 'id', cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### DeleteById - Error ###', function (t) {
  const facadeStub = sinon.stub(
    client,
    'calls',
    (id) => {
      return {
        delete: (callback) => {
          callback(errorMessage)
        }
      }
    }
  )

  sdkFacade.deleteById('calls', '', cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(cbSpy.calledTwice)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

