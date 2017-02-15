const Arrow = require('arrow')
module.exports = function (config, callback) {
  console.log('Inside factory....')
  const server = new Arrow(config)
  server.start(function () {
    callback(server)
  })
}
