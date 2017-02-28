const twilio = require('twilio')
const validate = require('./validator').validate

module.exports = function (config) {
  const client = new twilio.RestClient(config.sid, config.auth_token)

  return {
    client: client,
    createCall: createCall,
    createAddress: createAddress,
    createMessage: createMessage,
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

  function findAll (modelName, callback) {
    validate.model(modelName, callback)
    client[modelName].list({ 'PageSize': '1000' }, throwOrRespondWithData.bind(null, modelName, callback))
  }

  function findByID (modelName, id, callback) {
    validate.model(modelName, callback)
    validate.id(id, callback)
    client[modelName](id).get(throwOrRespondWithData.bind(null, modelName, callback))
  }

  function query (modelName, criteria, callback) {
    validate.model(modelName, callback)
    client[modelName].list(criteria, throwOrRespondWithData.bind(null, modelName, callback))
  }

  function createCall (payload, callback) {
    validate.numberTo(payload.to, callback)
    validate.numberFrom(payload.from, callback)
    client.makeCall(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createAddress (payload, callback) {
    client.addresses.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createMessage (payload, callback) {
    validate.numberTo(payload.to, callback)
    validate.numberFrom(payload.from, callback)
    validate.messageBody(payload.body, callback)
    client.messages.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createQueue (payload, callback) {
    client.queues.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createAccount (payload, callback) {
    client.accounts.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateAddress (id, payload, callback) {
    validate.id(id, callback)
    client.addresses(id).post(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateOutgoingCallerId (id, payload, callback) {
    validate.id(id, callback)
    client.outgoingCallerIds(id).post(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateQueue (id, payload, callback) {
    client.queues(id).update(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function deleteById (modelName, id, callback) {
    validate.id(id, callback)
    client[modelName](id).delete(throwOrRespondWithData.bind(null, modelName, callback))
  }
}

function throwOrRespondWithData (modelName, callback, err, data) {
  if (err) {
    callback(err)
  } else {
    if (modelName && data && data[modelName]) {
      callback(null, data[modelName])
    } else {
      callback(null, data)
    }
  }
}
