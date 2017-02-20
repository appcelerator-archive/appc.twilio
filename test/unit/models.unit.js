const test = require('tap').test
const { server } = require('../utils/server').startPlainArrow()

test('test call model', function (t) {
  const model = server.getModel('call')

  t.ok(model.fields, 'found model')

  t.equals(model.fields.sid.type, 'string')
  t.equals(model.fields.dateCreated.type, 'string')
  t.equals(model.fields.parentCallSid.type, 'string')
  t.equals(model.fields.to.type, 'string')
  t.equals(model.fields.from.type, 'string')
  t.equals(model.fields.fromFormatted.type, 'string')
  t.equals(model.fields.phoneNumberSid.type, 'string')
  t.equals(model.fields.status.type, 'string')
  t.equals(model.fields.startTime.type, 'string')
  t.equals(model.fields.endTime.type, 'string')
  t.equals(model.fields.duration.type, 'string')
  t.equals(model.fields.price.type, 'string')
  t.equals(model.fields.priceUnit.type, 'string')
  t.equals(model.fields.direction.type, 'string')
  t.equals(model.fields.answeredBy.type, 'string')
  t.equals(model.fields.annotation.type, 'string')
  t.equals(model.fields.apiVersion.type, 'string')
  t.equals(model.fields.forwardedFrom.type, 'string')
  t.equals(model.fields.groupSid.type, 'string')
  t.equals(model.fields.callerName.type, 'string')
  t.equals(model.fields.uri.type, 'string')
  t.equals(model.fields.subresourceUris.type, 'object')

  t.end()
})

test('test message model', function (t) {
  const model = server.getModel('message')

  t.ok(model.fields, 'found model')
  t.equals(model.fields.sid.type, 'string')
  t.equals(model.fields.dateCreated.type, 'string')
  t.equals(model.fields.dateUpdated.type, 'string')
  t.equals(model.fields.dateSent.type, 'string')
  t.equals(model.fields.accountSid.type, 'string')
  t.equals(model.fields.to.type, 'string')
  t.equals(model.fields.from.type, 'string')
  t.equals(model.fields.messagingServiceSid.type, 'string')
  t.equals(model.fields.body.type, 'string')
  t.equals(model.fields.status.type, 'string')
  t.equals(model.fields.numSegments.type, 'string')
  t.equals(model.fields.numMedia.type, 'string')
  t.equals(model.fields.direction.type, 'string')
  t.equals(model.fields.apiVersion.type, 'string')
  t.equals(model.fields.price.type, 'string')
  t.equals(model.fields.priceUnit.type, 'string')
  t.equals(model.fields.errorCode.type, 'string')
  t.equals(model.fields.errorMessage.type, 'string')
  t.equals(model.fields.uri.type, 'string')
  t.equals(model.fields.subresourceUris.type, 'object')

  t.end()
})

test('test account model', function (t) {
  const model = server.getModel('account')

  t.ok(model.fields, 'found model')

  t.equals(model.fields.sid.type, 'string')
  t.equals(model.fields.ownerAccountSid.type, 'string')
  t.equals(model.fields.friendlyName.type, 'string')
  t.equals(model.fields.status.type, 'string')
  t.equals(model.fields.dateCreated.type, 'string')
  t.equals(model.fields.dateUpdated.type, 'string')
  t.equals(model.fields.authToken.type, 'string')
  t.equals(model.fields.type.type, 'string')
  t.equals(model.fields.uri.type, 'string')
  t.equals(model.fields.subresourceUris.type, 'object')

  t.end()
})

test('test address model', function (t) {
  const model = server.getModel('address')

  t.ok(model.fields, 'found model')

  t.equals(model.fields.sid.type, 'string')
  t.equals(model.fields.accountSid.type, 'string')
  t.equals(model.fields.friendlyName.type, 'string')
  t.equals(model.fields.customerName.type, 'string')
  t.equals(model.fields.street.type, 'string')
  t.equals(model.fields.city.type, 'string')
  t.equals(model.fields.region.type, 'string')
  t.equals(model.fields.postalCode.type, 'string')
  t.equals(model.fields.isoCountry.type, 'string')

  t.end()
})

test('test queue model', function (t) {
  const model = server.getModel('queue')

  t.ok(model.fields, 'found model')

  t.equals(model.fields.sid.type, 'string')
  t.equals(model.fields.friendlyName.type, 'string')
  t.equals(model.fields.currentSize.type, 'number')
  t.equals(model.fields.averageWaitTime.type, 'number')
  t.equals(model.fields.maxSize.type, 'number')
  t.equals(model.fields.dateCreated.type, 'string')
  t.equals(model.fields.dateUpdated.type, 'string')
  t.equals(model.fields.uri.type, 'string')

  t.end()
})

