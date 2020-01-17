const path = require('path')
const ProcessManager = require('../utils/processManager')
const {validateCommand} = require('../utils/folders')
const gitRegex = '^git\\s[^&|;]*$'

class GitService {

    constructor() {
        this.processManager = new ProcessManager()
        this.websocket = null
        this.currentSharedFolder = null
    }

    setWebSocket(websocket) {
        this.websocket = websocket
    }

    sharedFolder(currentSharedFolder, readOnly) {
        this.currentSharedFolder = currentSharedFolder
        this.readOnly = readOnly
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
    command(args, callback) {
        validateCommand(args.script, gitRegex)
        const options = {cwd: this.currentSharedFolder, shell: true}
        this.processManager.spawnProcess(args.script, options, callback)
    }

}

const gitService = new GitService()
module.exports = gitService