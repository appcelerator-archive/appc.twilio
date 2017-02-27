const test = require('tap').test
const saveMethod = require('../../../lib/methods/save')['save']

test('Invoke save', function (t) {
  saveMethod.bind()()

  t.end()
})
