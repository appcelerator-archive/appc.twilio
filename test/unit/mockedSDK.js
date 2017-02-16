module.exports = function (config) {
  return {
    createCall: createCall,
    createAddress: createAddress,
    createMessage: createMessage,
    createOutgoingCallerId: createOutgoingCallerId,
    createQueue: createQueue,
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
    const instances = []
    const data = require('./messages')

    data.map((item, index) => {
      const instance = Model.instance(item, true)
      instance.setPrimaryKey(index + 1)
      instances.push(instance)
    })

    callback(null, instances)
  }

  function findByID (Model, id, callback) {
    if (!id) {
      callback(new Error('Missing required parameter "id"'))
    }

    const data = require('./messages')

    data.forEach((item) => {
      if (item.sid === id) {
        callback(null, Model.instance(item, true))
      }
    })
  }

  function query (Model, options, callback) {
    const instances = []

    const data = require('./query')

    data.forEach((item) => {
      instances.push(Model.instance(item, true))
    })

    callback(null, instances)
  }

  function createCall (Model, values, number, callback) {
    values.From = number
    callback(null, Model.instance(values, true))
  }

  function createAddress (Model, values, callback) {
    callback(null, Model.instance(values, true))
  }

  function createMessage (Model, values, number, callback) {
    values.From = number
    callback(null, Model.instance(values, true))
  }

  function createQueue (Model, values, number, callback) {
    var instance = Model.instance(values, true)
    callback(null, instance)
  }

  function createOutgoingCallerId (Model, values, number, callback) {
    callback(null, Model.instance(values, true))
  }

  function updateAddress (Model, id, doc, callback) {
    callback(null, [])
  }

  function updateOutgoingCallerId (Model, id, doc, callback) {
    callback(null, [])
  }

  function updateQueue (Model, id, doc, callback) {
    callback(null, [])
  }

  function deleteById (Model, id, callback) {
    callback(null, [])
  }
}
