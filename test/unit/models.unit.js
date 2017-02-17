const test = require('tap').test
const { server } = require('../server/factory').startPlainArrow()

test('test call model', function (t) {
  const model = server.getModel('call')

  t.ok(model.fields, 'found model')

  for (var field in model.fields) {
    if (model.fields.hasOwnProperty(field)) {
      if (field === 'subresource_uris') {
        t.equals(model.fields[field].type, 'object')
      } else {
        t.equals(model.fields[field].type, 'string')
      }
    }
  }
  t.end()
})

test('test message model', function (t) {
  const model = server.getModel('message')

  t.ok(model.fields, 'found model')

  for (var field in model.fields) {
    if (model.fields.hasOwnProperty(field)) {
      if (field === 'subresource_uris') {
        t.equals(model.fields[field].type, 'object')
      } else {
        t.equals(model.fields[field].type, 'string')
      }
    }
  }
  t.end()
})

test('test account model', function (t) {
  const model = server.getModel('account')

  t.ok(model.fields, 'found model')

  for (var field in model.fields) {
    if (model.fields.hasOwnProperty(field)) {
      if (field === 'subresource_uris') {
        t.equals(model.fields[field].type, 'object')
      } else {
        t.equals(model.fields[field].type, 'string')
      }
    }
  }
  t.end()
})

test('test address model', function (t) {
  const model = server.getModel('address')

  t.ok(model.fields, 'found model')

  for (var field in model.fields) {
    if (model.fields.hasOwnProperty(field)) {
      if (field === 'subresource_uris') { t.equals(model.fields[field].type, 'object') } else {
        t.equals(model.fields[field].type, 'string')
      }
    }
  }
  t.end()
})

test('test transcription model', function (t) {
  const model = server.getModel('transcription')

  t.ok(model.fields, 'found model')

  for (var field in model.fields) {
    if (model.fields.hasOwnProperty(field)) {
      if (field === 'subresource_uris') {
        t.equals(model.fields[field].type, 'object')
      } else {
        t.equals(model.fields[field].type, 'string')
      }
    }
  }
  t.end()
})

test('test queue model', function (t) {
  const model = server.getModel('queue')

  t.ok(model.fields, 'found model')

  t.equals(model.fields['sid'].type, 'string')
  t.equals(model.fields['friendlyName'].type, 'string')
  t.equals(model.fields['current_size'].type, 'number')
  t.equals(model.fields['average_wait_time'].type, 'number')
  t.equals(model.fields['max_size'].type, 'number')
  t.equals(model.fields['date_created'].type, 'string')
  t.equals(model.fields['date_updated'].type, 'string')
  t.equals(model.fields['uri'].type, 'string')

  t.end()
})

