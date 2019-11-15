const {spawn} = require('child_process')

class ProcessManager {

  cmd(args, callback, onclose) {
    const options = {cwd: process.env.SHARED_FOLDER, shell: true};
    const {cmd} = args;
    this.spawnProcess(cmd, options, callback, onclose);
  }

  spawnProcess (cmd, options, callback, onclose) {
    const child = spawn(cmd, options)
    let result = "";
    let error = "";
    if (callback) {
      child.stdout.on('data', (data) => {
        result.append(data);
      })
      child.stderr.on('data', (err) => {
        error.append(err);
      })
    }
    if (onclose) {
      child.on('close', onclose)
    }
  }

}

module.exports = ProcessManager;
