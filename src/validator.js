module.exports = {
  validate: {
    id: validateId,
    model: validateModel,
    numberTo: validateToNumber,
    numberFrom: validateFromNumber,
    messageBody: validateMessageBody
  }
}

function validateId (id, callback) {
  if (!id) {
    callback(new Error('Missing required parameter "id"'))
  }
}

function validateModel (model, callback) {
  if (!model) {
    callback(new Error('Missing required parameter "model"'))
  }
}

function validateToNumber (toNumber, callback) {
  if (!toNumber) {
    callback(new Error('Required parameters "toNumber" must be passed to make a call'))
  }
}

function validateFromNumber (fromNumber, callback) {
  if (!fromNumber) {
    callback(new Error('Required parameters "fromNumber" must be passed to make a call'))
  }
}

function validateMessageBody (messageBody, callback) {
  if (!messageBody) {
    callback(new Error('Required parameters "messageBody" must be passed to send message'))
  }
}
