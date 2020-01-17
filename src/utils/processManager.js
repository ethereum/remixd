const {spawn} = require('child_process')

class ProcessManager {

  spawnProcess (cmd, options, callback) {
    const child = spawn(cmd, options)
    let result = ''
    let error = ''
    if (callback) {
      child.stdout.on('data', (data) => {
        result += data.toString()
      })
      child.stderr.on('data', (err) => {
        error += err.toString()
      })
      child.on('close', (exitCode) => {
        if(exitCode !== 0){
          callback(error, null)
        } else {
          callback(null, result+error)
        }
      })
    }
  }

}

module.exports = ProcessManager