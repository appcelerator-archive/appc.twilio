const twilio = require('twilio')

module.exports = function (config) {
  const client = new twilio.RestClient(config.sid, config.auth_token)

  return {
    client: client,
    createCall: createCall,
    createAddress: createAddress,
    createMessage: createMessage,
    createOutgoingCallerId: createOutgoingCallerId,
    createQueue: createQueue,
    createAccount: createAccount,
    query: query,
    updateAddress: updateAddress,
    updateOutgoingCallerId: updateOutgoingCallerId,
    updateQueue: updateQueue,
    deleteById: deleteById,
    find: {
      all: findAll,
      byId: findByID
    }
  }

  function findAll (model, callback) {
    validateModel(model, callback)
    client[model].list(throwOrRespondWithData.bind(null, model, callback))
  }

  function findByID (model, id, callback) {
    validateModel(model, callback)
    validateId(id, callback)
    client[model](id).get(throwOrRespondWithData.bind(null, model, callback))
  }

  function query (model, criteria, callback) {
    // TODO: test how it behaves when criteria is undefined
    validateModel(model, callback)
    client[model].list(criteria, throwOrRespondWithData.bind(null, model, callback))
  }

  function createCall (payload, callback) {
    validateToNumber(payload.to)
    validateFromNumber(payload.from)
    client.makeCall(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createAddress (payload, callback) {
    client.addresses.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createMessage (payload, callback) {
    validateToNumber(payload.to)
    validateFromNumber(payload.from)
    validateMessageBody(payload.body)
    client.messages.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createQueue (payload, callback) {
    client.queues.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createOutgoingCallerId (payload, callback) {
    client.outgoingCallerIds.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createAccount (payload, callback) {
    client.accounts.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateAddress (id, payload, callback) {
    validateId(id, callback)
    client.addresses(id).post(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateOutgoingCallerId (id, payload, callback) {
    validateId(id, callback)
    client.outgoingCallerIds(id).post(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateQueue (id, payload, callback) {
    client.queues(id).update(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function deleteById (model, id, callback) {
    validateId(id, callback)
    client[model](id).delete(throwOrRespondWithData.bind(null, model, callback))
  }
}

function validateId (id, callback) {
  if (!id) {
    callback(new Error('Missing required parameter "id"'))
  }
}

function validateModel (model, callback) {
  if (!model) {
    callback(new Error('Missing required parameter "model"'))
  }
}

function validateToNumber (toNumber, callback) {
  if (!toNumber) {
    callback(new Error('Required parameters "toNumber" must be passed to make a call'))
  }
}

function validateFromNumber (fromNumber, callback) {
  if (!fromNumber) {
    callback(new Error('Required parameters "fromNumber" must be passed to make a call'))
  }
}

function validateMessageBody (messageBody, callback) {
  if (!messageBody) {
    callback(new Error('Required parameters "messageBody" must be passed to send message'))
  }
}

function throwOrRespondWithData (model, callback, err, data) {
  if (err) {
    callback(err)
  } else {
    if (model) {
      callback(null, data[model])
    } else {
      callback(null, data)
    }
  }
}
