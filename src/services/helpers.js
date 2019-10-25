const whitelistedCommands = ["git","ls","touch"];
let services  = require('../services');
const Router = require('../router');

function setupRouter(){
    //TODO: Refactor this!
    let program = require('commander')

    let enabledServices = {}
    const registerService = (name, service) => enabledServices[name] = service

    program
    .usage('[options]')
    .description('Provide a two-way connection between the local computer and Remix IDE')
    .option('--remix-ide  <url>', 'URL of remix instance allowed to connect to this web socket connection', 'https://remix.ethereum.org')
    .option('-s, --shared-folder <path>', 'Folder to share with Remix IDE')
    .option('--read-only', 'Treat shared folder as read-only (experimental)')
    .option('--forward-commands', 'Enables CLI commands forwarding')
    .on('--help', function() {
        console.log('\nExample:\n\n    remixd -s ./ --remix-ide http://localhost:8080\n')
    }).parse(process.argv)

    console.log('\x1b[33m%s\x1b[0m', '[WARN] You may now only use IDE at ' + program.remixIde + ' to connect to this instance')

    if (program.sharedFolder) {
        console.log('\x1b[33m%s\x1b[0m', '[WARN] Any application that runs on your computer can potentially read from and write to all files in the directory.')
        console.log('\x1b[33m%s\x1b[0m', '[WARN] Symbolic links are not forwarded to Remix IDE\n')
        let sharedFolderService = services.sharedfolder;
        sharedFolderService.sharedFolder(program.sharedFolder, program.readOnly || false);
        registerService('sharedfolder', sharedFolderService);
    }

    if (program.forwardCommands) {
        if (!program.sharedFolder) {
            console.log('Could not forward commands without specified shared folder (use --shared-folder <path> option)');
            return;
        }
        console.log('\x1b[33m%s\x1b[0m', '[WARN] You have enabled CLI commands forwarding. Use at your own risk.')
        let commandForwarderService = services['commandforwarder'];
        commandForwarderService.workingDirectory(program.sharedFolder);
        registerService('commandforwarder', commandForwarderService);
    }

    //Remove this part completely!
    router = new Router(65520, enabledServices, { remixIdeUrl: program.remixIde });
    let cb = router.start()

    process.on('SIGINT', function () {
        cb();
        process.exit();
    });
    process.on('SIGTERM', cb)
    process.on('exit', cb)
      
    return router;
}

let app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server)

function setupWebSocket(){
    io.on('connection', (socket) => {
        console.log('A user connected');
    
        //Why is `reply` needed here?
        socket.on('reply', (scope) => {
            console.log(scope);
            //'{"id":1,"service":"commandforwarder","fn":"forward","args":{"cmd":"touch laaa"}}'
            let json = JSON.parse(scope);
            console.log(json);
            let id = json["id"];
            let service = json["service"];
            let fn = json["fn"];
            let args = json["args"];
            console.log(id +  " " + service + " " + fn + " " + args);
            try {
                eval(`router.${service}.${fn}(json)`);
            } catch (err) {
                //Use Error Handler
                console.log(err);
            }
        });
    
        socket.on('disconnect', function(){
          console.log('User disconnected');
      });
    });
}

function validateCommand(json){
    let command = json["args"]["cmd"];
    let result = false;
    for (i = 0; i < whitelistedCommands.length; i++) {
        if(command.startsWith(whitelistedCommands[i])){
            result = true;
        }
    }
    if(!result){
        throw new UnsuportedCommand("Unsupported command :" + command);
    }
}

module.exports = {
    validateCommand,
    setupRouter,
    setupWebSocket
}