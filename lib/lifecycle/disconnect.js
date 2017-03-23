/**
 * Disconnects from your data store.
 * @param next
 */
exports.disconnect = function (next) {
  this.twilioAPI = null
  this.tools = null
  next()
}
