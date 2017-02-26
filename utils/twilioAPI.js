const pluralize = require('pluralize')

module.exports = function (config, sdkFacade, transformer) {
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
    sdkFacade.updateAddress(Model, id, doc, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function updateOutgoingCallerId (Model, id, doc, callback) {
    sdkFacade.updateOutgoingCallerId(Model, id, doc, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function updateQueue (Model, id, doc, callback) {
    sdkFacade.updateQueue(Model, id, doc, throwErrorOrTransformToModel.bind(null, Model, callback))
  }

  function deleteById (Model, id, callback) {
    sdkFacade.deleteById(Model, id, throwErrorOrTransformToModel.bind(null, Model, callback))
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

