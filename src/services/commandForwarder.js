const { spawn } = require('child_process');

module.exports = {
    forward: function(args, callback) {
        const options = { cwd: process.env.SHARED_FOLDER, shell: true };
        const { cmd } = args;
        const child = spawn(cmd, options);
        child.stdout.on('data', (buffer) => {
            callback(null, { chunk: `${buffer}` });
        });
        child.stderr.on('data', (buffer) => {
            callback(`stderr: ${buffer}`);
        })
    }
}