const { exec } = require('child_process');

module.exports = {
    init: function(websocket) {
        this.websocket = websocket;
    },

    workingDirectory: function(workingDirectory) {
        this.workingDirectory = workingDirectory;
    },

    forward: function(args, callback) {
        const options = { cwd: this.workingDirectory };
        exec(args.cmd, options, (err, stdout, stderr) => {
            if (err) {
                callback(`Could not execute command '${cmd}': ${err}`);
                return;
            }
            callback(null, {
                cmd: args.cmd,
                stdout: stdout,
                stderr: stderr
            });
        });
    }
}