const { exec } = require('child_process')

module.exports = {

  init: function (args, cb) {
    try {
      var _path = getRemixdPath() + 'node_modules/truffle/build/cli.bundled.js' 
      exec(_path + ' init', (err, stdout, stderr) => {
        if (err) {
          console.error(`${err}`)
          console.log(cb)
          cb(err)
        } else { 
          console.log(`${stdout}`)
          console.log(cb)
          cb(null, stdout)
        }
      })
    } catch (e) {
      cb(e.message, null)
    }
  }, 

  test: function (args, cb) {
    try {
      var _path = getRemixdPath() + 'node_modules/truffle/build/cli.bundled.js' 
      exec(_path + ' test', (err, stdout, stderr) => {
        if (err) {
          console.error(`${err}`)
          cb(err)
        } else { 
          console.log(`${stdout}`)
          cb(null, stdout)
        }
      })
    } catch (e) {
      cb(e.message)
    }
  }

}

function getRemixdPath() {
  var path = __dirname
  var arr = __dirname.split('/')
  arr = arr.slice(0, arr.length - 2)
  return arr.join('/') + '/'
}
