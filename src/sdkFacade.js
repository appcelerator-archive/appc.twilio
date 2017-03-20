const twilio = require('twilio')
const messages = {
  missingId: 'Missing required parameter "id"',
  missingModel: 'Missing required parameter "model"',
  missingToNumber: 'Required parameters "toNumber" must be passed to make a call',
  missingFromNumber: 'Required parameters "fromNumber" must be passed to make a call',
  missingMessageBody: 'Required parameters "messageBody" must be passed to send message'
}

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
    throwOnMissingMandatoryField(modelName, callback, messages.missingModel)
    client[modelName].list({ 'PageSize': '1000' }, throwOrRespondWithData.bind(null, modelName, callback))
  }

  function findByID (modelName, id, callback) {
    throwOnMissingMandatoryField(modelName, callback, messages.missingModel)
    throwOnMissingMandatoryField(id, callback, messages.missingId)
    client[modelName](id).get(throwOrRespondWithData.bind(null, modelName, callback))
  }

  function query (modelName, criteria, callback) {
    throwOnMissingMandatoryField(modelName, callback, messages.missingModel)
    client[modelName].list(criteria, throwOrRespondWithData.bind(null, modelName, callback))
  }

  function createCall (payload, callback) {
    throwOnMissingMandatoryField(payload.to, callback, messages.missingToNumber)
    throwOnMissingMandatoryField(payload.from, callback, messages.missingFromNumber)
    client.makeCall(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createAddress (payload, callback) {
    client.addresses.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createMessage (payload, callback) {
    throwOnMissingMandatoryField(payload.to, callback, messages.missingToNumber)
    throwOnMissingMandatoryField(payload.from, callback, messages.missingFromNumber)
    throwOnMissingMandatoryField(payload.body, callback, messages.missingMessageBody)
    client.messages.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createQueue (payload, callback) {
    client.queues.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function createAccount (payload, callback) {
    client.accounts.create(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateAddress (id, payload, callback) {
    throwOnMissingMandatoryField(id, callback, messages.missingId)
    client.addresses(id).post(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateOutgoingCallerId (id, payload, callback) {
    throwOnMissingMandatoryField(id, callback, messages.missingId)
    client.outgoingCallerIds(id).post(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function updateQueue (id, payload, callback) {
    throwOnMissingMandatoryField(id, callback, messages.missingId)
    client.queues(id).update(payload, throwOrRespondWithData.bind(null, null, callback))
  }

  function deleteById (modelName, id, callback) {
    throwOnMissingMandatoryField(modelName, callback, messages.missingModel)
    throwOnMissingMandatoryField(id, callback, messages.missingId)
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

function throwOnMissingMandatoryField (field, callback, errorMessage) {
  if (!field) {
    callback(new Error(errorMessage))
  }
}
