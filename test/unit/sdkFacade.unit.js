const test = require('tap').test
const config = {
  sid: '123456789012345678901234567890112345',
  auth_token: '123456789012345678901234567890112345',
  twilio_number: '123'
}
const sinon = require('sinon')
const sdkFacade = require('../../src/sdkFacade')(config)
const client = sdkFacade.client
const cbSpy = sinon.spy()
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

  sdkFacade.create.call({ to: '132321', from: '242342' }, cbSpy)

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

  sdkFacade.create.call({ to: '132321', from: '242342' }, cbSpy)

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

  sdkFacade.create.queue({ maxSize: '132321', friendlyName: '242342' }, cbSpy)

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

  sdkFacade.create.queue({ maxSize: '132321', friendlyName: '242342' }, cbSpy)

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

  sdkFacade.create.address({ friendlyName: 'name' }, cbSpy)

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

  sdkFacade.create.address({ friendlyName: 'name' }, cbSpy)

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

  sdkFacade.create.account({ friendlyName: 'name' }, cbSpy)

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

  sdkFacade.create.account({ friendlyName: 'name' }, cbSpy)

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
  const cbSpy1 = sinon.spy((payload, callback) => {
    callback(null, dataFromTwilio)
  })
  const values = { to: 'number' }
  const facadeStub = sinon.stub(
    client,
    'addresses',
    (id) => {
      return {
        post: cbSpy1
      }
    }
  )

  sdkFacade.update.address('id', values, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy1.calledWith(values))
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateAddress - Error ###', function (t) {
  const values = { to: 'number' }
  const cbSpy1 = sinon.spy((payload, callback) => {
    callback(errorMessage)
  })

  const facadeStub = sinon.stub(
    client,
    'addresses',
    (id) => {
      return {
        post: cbSpy1
      }
    }
  )

  sdkFacade.update.address('id', values, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy1.calledWith(values))
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateOutgoingCallerId - Success ###', function (t) {
  const values = { to: 'number' }
  const cbSpy1 = sinon.spy((payload, callback) => {
    callback(null, dataFromTwilio)
  })
  const facadeStub = sinon.stub(
    client,
    'outgoingCallerIds',
    (id) => {
      return {
        post: cbSpy1
      }
    }
  )

  sdkFacade.update.outgoingCallerId('id', values, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy1.calledWith(values))
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateOutgoingCallerId - Error ###', function (t) {
  const values = { to: 'number' }
  const cbSpy1 = sinon.spy((payload, callback) => {
    callback(errorMessage)
  })
  const facadeStub = sinon.stub(
    client,
    'outgoingCallerIds',
    (id) => {
      return {
        post: cbSpy1
      }
    }
  )

  sdkFacade.update.outgoingCallerId('id', values, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy1.calledWith(values))

  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateQueue - Success ###', function (t) {
  const values = { to: 'number' }
  const cbSpy1 = sinon.spy((payload, callback) => {
    callback(null, dataFromTwilio)
  })
  const facadeStub = sinon.stub(
    client,
    'queues',
    (id) => {
      return {
        update: cbSpy1
      }
    }
  )

  sdkFacade.update.queue('id', values, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy1.calledWith(values))
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### UpdateQueue - Error ###', function (t) {
  const values = { to: 'number' }
  const cbSpy1 = sinon.spy((payload, callback) => {
    callback(errorMessage)
  })
  const facadeStub = sinon.stub(
    client,
    'queues',
    (id) => {
      return {
        update: cbSpy1
      }
    }
  )

  sdkFacade.update.queue('id', values, cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy1.calledWith(values))
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### DeleteById - Success ###', function (t) {
  const cbSpy1 = sinon.spy((callback) => {
    callback(null, dataFromTwilio)
  })
  const facadeStub = sinon.stub(
    client,
    'calls',
    (id) => {
      return {
        delete: cbSpy1
      }
    }
  )

  sdkFacade.deleteById('calls', 'id', cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(null, dataFromTwilio))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

test('### DeleteById - Error ###', function (t) {
  const cbSpy1 = sinon.spy((callback) => {
    callback(errorMessage)
  })
  const facadeStub = sinon.stub(
    client,
    'calls',
    (id) => {
      return {
        delete: cbSpy1
      }
    }
  )

  sdkFacade.deleteById('calls', 'id', cbSpy)

  t.ok(facadeStub.calledOnce)
  t.ok(facadeStub.calledWith('id'))
  t.ok(cbSpy1.calledOnce)
  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  facadeStub.restore()
  cbSpy.reset()

  t.end()
})

