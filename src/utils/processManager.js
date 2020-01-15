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
          callback({type: 'error', result: "", error: result + error})
        } else {
          callback({type: 'response', result: result + error, error: ""})
        }
      })
    }
  }

}

module.exports = ProcessManager
