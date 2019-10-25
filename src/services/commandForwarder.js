const { exec } = require('child_process');

module.exports = {
    //Do we need this now?
    init: function(websocket) {
        this.websocket = websocket;
    },

    forward: function(json){
        let command = json["args"]["cmd"];
        console.log(command);
        let workingDirectory = process.env.SHARED_FOLDER;
        console.log("Working Directory:" + workingDirectory);
        const options = { cwd: workingDirectory };
        exec(command, options, (err, stdout, stderr) => {
            if (err) {
                console.log(`Could not execute command '${cmd}': ${err}`);
                return;
            }
        });
    },
    
    forwardOld: function(args, callback) {
        const options = { cwd: workingDirectory };
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