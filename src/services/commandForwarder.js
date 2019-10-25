const { exec } = require('child_process');

module.exports = {
    forward: function(args, callback) {
        const options = { cwd: process.env.SHARED_FOLDER };
        const { cmd } = args;
        exec(cmd, options, (err, stdout, stderr) => {
            if (err) {
                callback(`Could not execute command '${cmd}': ${err}`);
                return;
            }
            callback(null, { cmd, stdout, stderr });
        });
    }
}