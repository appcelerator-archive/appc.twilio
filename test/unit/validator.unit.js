const test = require('tap').test
const sinon = require('sinon')
const validator = require('./../../utils/validator').validate
const errorMessage = new Error()
function cb (errorMessage) { }
const cbSpy = sinon.spy(cb)

test('### validateModel - Error ###', function (t) {
  validator.model('', cbSpy)

  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  cbSpy.reset()

  t.end()
})

test('### validateModel - Success ###', function (t) {
  validator.model('call', cbSpy)

  t.ok(cbSpy.notCalled)

  cbSpy.reset()

  t.end()
})

test('### validateId ###', function (t) {
  validator.id('', cbSpy)

  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  cbSpy.reset()

  t.end()
})

test('### validateId - Success ###', function (t) {
  validator.id('call', cbSpy)

  t.ok(cbSpy.notCalled)

  cbSpy.reset()

  t.end()
})

test('### validateMessageBody ###', function (t) {
  validator.messageBody('', cbSpy)

  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  cbSpy.reset()

  t.end()
})

test('### validateMessageBody - Success ###', function (t) {
  validator.messageBody('call', cbSpy)

  t.ok(cbSpy.notCalled)

  cbSpy.reset()

  t.end()
})

test('### validateToNumber ###', function (t) {
  validator.numberTo('', cbSpy)

  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  cbSpy.reset()

  t.end()
})

test('### validateToNumber - Success ###', function (t) {
  validator.numberTo('call', cbSpy)

  t.ok(cbSpy.notCalled)

  cbSpy.reset()

  t.end()
})

test('### validateFromNumber ###', function (t) {
  validator.numberFrom('', cbSpy)

  t.ok(cbSpy.calledOnce)
  t.ok(cbSpy.calledWith(errorMessage))

  cbSpy.reset()

  t.end()
})

test('### validateFromNumber - Success ###', function (t) {
  validator.numberFrom('call', cbSpy)

  t.ok(cbSpy.notCalled)

  cbSpy.reset()

  t.end()
})
