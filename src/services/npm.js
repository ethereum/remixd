const { exec } = require('child_process')

module.exports = {

  build: function (args, cb) {
    try {
      exec('npm build', (err, stdout, stderr) => {
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

  init: function (args, cb) {
    try {
      exec('npm init', (err, stdout, stderr) => {
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

  install: function (args, cb) {
    try {
      exec('npm install --save ' + args.pkg, (err, stdout, stderr) => {
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
