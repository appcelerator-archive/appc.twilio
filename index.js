exports = module.exports = require('./lib')

if (module.id === '.') {
  const fs = require('fs')
  const path = require('path')
  const appjs = path.join(__dirname, 'app.js')
  if (fs.existsSync(appjs)) {
    try {
      require(appjs)
    } catch (E) {
      console.error(E)
    }
  }
}
