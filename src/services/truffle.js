const { exec } = require('child_process')

module.exports = {

  init: function (args, cb) {
    try {
      exec('truffle init', (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`)
          cb(err)
        } else { 
          console.log(`truffle init output: ${stdout}`)
          cb(null, stdout)
        }
      })
    } catch (e) {
      cb(e.message)
    }
  }, 

  test: function (args, cb) {
    try {
      exec('truffle test', (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`)
          cb(err)
        } else { 
          console.log(`truffle test output: ${stdout}`)
          cb(null, stdout)
        }
      })
    } catch (e) {
      cb(e.message)
    }
  }

}
