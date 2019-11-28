const path = require('path')
const ProcessManager = require('../utils/processManager')
const {validateCommand} = require('../utils/utils')
const gitRegex = '^git\\s[^&|;]*$'

class GitService {

  constructor () {
    this.processManager = new ProcessManager()
    this.sharedFolder = path.resolve(__dirname, '../..', process.env.SHARED_FOLDER)
  }

  /**
   * Create and check if command is valid
   * @param action
   * @param id
   * @param key
   * @param name
   * @param payload
   * @param callback
   */
  command (action, id, key, name, payload, callback) {
    let cmd = `${name} ${key}`
    if (payload !== undefined) {
      cmd += ` ${payload}`
    }
    validateCommand(cmd, gitRegex)

    const options = {cwd: this.sharedFolder, shell: true}
    this.processManager.spawnProcess(cmd, options, callback)
  }

}

const gitService = new GitService()
module.exports = gitService
