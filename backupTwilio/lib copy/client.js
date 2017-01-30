const twilio = require('twilio');
var def = require('./../conf/default');

// Get connector config from default.js
const config = def.connectors['appc.twilio'];

function getClient() {

    return client = new twilio.RestClient(config.sid, config.auth_token);
}

module.exports.getClient = getClient;
