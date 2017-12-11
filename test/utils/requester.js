const request = require('request')

module.exports = (appConfig) => {
  appConfig = appConfig || {}
  const port = appConfig.port || 8080
  const baseUrl = `http://localhost:${port}`
  const apiPrefix = appConfig.apiPrefix || '/api'
  const url = `${baseUrl}${apiPrefix}`

  return {
    getData: (options, callback) => {
      makeRequest(createRequestOptions(options), callback)
    },

    getDataByID: (options, callback) => {
      options.uri = `${url}/${options.model}/${options.id}`
      makeRequest(createRequestOptions(options), callback)
    },

    getDataByQuery: (options, callback) => {
      options.uri = `${url}/${options.model}/query?${options.where}`
      makeRequest(createRequestOptions(options), callback)
    },

    postData: (options, callback) => {
      options.method = 'POST'
      makeRequest(createRequestOptions(options), callback)
    },

    deleteData: (options, callback) => {
      options.uri = `${url}/${options.model}/${options.id}`
      options.method = 'DELETE'
      makeRequest(createRequestOptions(options), callback)
    }
  }

  function createRequestOptions (options) {
    const requestOptions = {
      uri: options.uri || `${url}/${options.model}`,
      method: options.method || 'GET',
      json: true,
      body: options.body || {}
    }
    const defaultAuth = {
      user: appConfig.apikey
    }

    if (options.auth) {
      requestOptions.auth = options.auth
    } else if (!options.skipAuth) {
      requestOptions.auth = defaultAuth
    }

    return requestOptions
  }

  function makeRequest (options, callback) {
    request(options, function (err, response, body) {
      if (err) {
        throw new Error(err.message)
      }
      callback(response, body)
    })
  }
}
