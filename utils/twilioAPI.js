const twilio = require('twilio')
const pluralize = require('pluralize')

module.exports = function (config, sdkFacade, transformer) {
  const client = new twilio.RestClient(config.sid, config.auth_token)

  return {
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

  function findAll (Model, callback) {
    const key = pluralize(Model.name)
    sdkFacade.find.all(key, throwErrorOrTransformToCollection.bind(null, Model, callback))
  }

  function findByID (Model, id, callback) {
    const key = pluralize(Model.name)
    sdkFacade.find.byId(key, id, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function query (Model, options, callback) {
    const key = pluralize(Model.name)
    sdkFacade.query(key, throwErrorOrTransformToCollection.bind(null, Model, callback))
  }

  function createCall (Model, values, number, callback) {
    sdkFacade.createCall({
      to: values.to,
      from: number,
      url: config.twilioWelcomeVoiceURL
    }, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function createAddress (Model, values, callback) {
    sdkFacade.createAddress(values, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function createMessage (Model, values, number, callback) {
    sdkFacade.createMessage({
      to: values.to,
      from: number,
      body: values.body
    }, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function createQueue (Model, values, callback) {
    sdkFacade.createQueue(values, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function createAccount (Model, values, callback) {
    sdkFacade.createAccount(values, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function updateAddress (Model, id, doc, callback) {
    client.addresses(id).post(doc, function (err, address) {
      if (err) {
        callback(new Error(err.message))
      }
      // TODO check this out - upsert
      Model.instance(address, true)
      callback(null, [])
    })
  }

  function updateOutgoingCallerId (Model, id, doc, callback) {
    client.outgoingCallerIds(id).post({
      friendlyName: doc
    }, function (err, callerId) {
      if (err) {
        callback(new Error(err.message))
      }
      callback(null, [])
    })
  }

  function updateQueue (Model, id, doc, callback) {
    client.queues(id).update(doc, function (err, queue) {
      if (err) {
        callback(new Error(err.message))
      }

      callback(null, [])
    })
  }

  function deleteById (Model, id, callback) {
    const key = pluralize(Model.name)

    if (!id) {
      callback(new Error('Missing required parameter "id"'))
    }
    client[key](id).delete(function (err, data) {
      if (err) {
        callback(new Error(err.message))
      }

      callback(null, data)
    })
  }

  function throwErrorOrTransformToCollection (Model, callback, err, data) {
    if (err) {
      callback(err)
    } else {
      callback(null, transformer.transformToCollection(Model, data))
    }
  }

  function throwErrorOrTransformToModel (Model, callback, err, data) {
    if (err) {
      callback(err)
    } else {
      callback(null, transformer.transformToModel(Model, data))
    }
  }
}

