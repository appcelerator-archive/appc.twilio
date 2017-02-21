const request = require('request')

module.exports = (appConfig) => {
  const port = appConfig.port || 8080
  const baseUrl = `http://localhost:${port}`
  const apiPrefix = appConfig.apiPrefix
  const url = `${baseUrl}${apiPrefix}`

  return {
    getData: (options, callback) => {
      makeRequest(createRequestOptions(options), callback)
    },

    postData: (options, callback) => {
      options.method = 'POST'
      makeRequest(createRequestOptions(options), callback)
    },

    deleteData: (options, callback) => {
      options.method = 'DELETE'
      makeRequest(createRequestOptions(options), callback)
    }
  }

  function createRequestOptions (options) {
    const requestOptions = {
      uri: `${url}${options.model}`,
      method: options.method || 'GET',
      json: true
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

