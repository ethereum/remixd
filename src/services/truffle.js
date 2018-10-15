const fs = require('fs-extra')
const { exec } = require('child_process')

module.exports = {

  setSharedFolder: function (path) {
    this.path = path
  },

  /**
   * FIXME - This can be made more general. It would be useful to allow the directory to initialize to be specified
   * Initializes a truffle repository within the current working directory of the Remixd server. 
   * @param {Object} args - An arguments object. FIXME - Unused 
   * @param {Function} cb - Callback function that reports errors and output back to the remix browser.
   */ 
  init: function (args, cb) {
    try {
      var path = getRemixdPath() + 'node_modules/truffle/build/cli.bundled.js' 
      exec(path + ' init', { cwd: this.path }, (err, stdout, stderr) => {
        if (err) {
          console.error(`${err}`)
          cb(err)
        } else { 
          console.log(`${stdout}`)
          cb(null, stdout)
        }
      })
    } catch (e) {
      cb(e.message, null)
    }
  }, 

  /**
   * FIXME - This can be made more general. It would be useful to allow the directory to test to be specified
   * Runs the test suite within the current working directory's truffle development environment.   
   * @param {Object} args - An arguments object. FIXME - Unused 
   * @param {Function} cb - Callback function that reports errors and output back to the remix browser.
   */ 
  test: function (args, cb) {
    try {
      var path = getRemixdPath() + 'node_modules/truffle/build/cli.bundled.js' 
      exec(path + ' test', { cwd: this.path }, (err, stdout, stderr) => {
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
  },
  
  /**
   * Gets the truffle environment configuration of the current working directory and send the
   * data to the remix browser. 
   * @param {Object} args - An arguments object. FIXME - Unused 
   * @param {Function} cb - Callback function that reports errors and output back to the remix browser.
   */ 
  getEnv: function (args, cb) {
    try {
      var config = fs.readFile(this.path + '/truffle-config.js')
      cb(null, config)
    } catch (e) {
      cb(e.message)
    }
  }

}


/** Returns the path to the remix directory. */
function getRemixdPath() {
  var path = __dirname
  var arr = __dirname.split('/')
  arr = arr.slice(0, arr.length - 2)
  return arr.join('/') + '/'
}
