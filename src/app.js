#!/usr/bin/env node
let app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const path = require('path');
const dotenv = require('dotenv');
const serviceRouter = require('./serviceRouter');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Move to router
app.get('/', function(req, res){
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

//Commander part
let program = require('commander');

program
    .usage('[options]')
    .description('Provide a two-way connection between the local computer and Remix IDE')
    .option('--remix-ide  <url>', 'URL of remix instance allowed to connect to this web socket connection', 'https://remix.ethereum.org')
    .option('-s, --shared-folder <path>', 'Folder to share with Remix IDE')
    .option('--read-only', 'Treat shared folder as read-only (experimental)')
    .option('--forward-commands', 'Enables CLI commands forwarding')
    .option('--env-file', 'Loads env from env file on path')
    .on('--help', function () {
        console.log('\nExample:\n\n    remixd -s ./ --remix-ide http://localhost:8080\n')
    }).parse(process.argv)

console.log('\x1b[33m%s\x1b[0m', '[WARN] You may now only use IDE at ' + program.remixIde + ' to connect to this instance')

if(program.envFile){
    let options = {};
    options.path = path.resolve(process.cwd(), program.envFile);
    dotenv.config(options);
}

process.env.SERVICES = serviceRouter;
if(program.remixIde){
    process.env.URL = program.remixIde;
}

if(program.sharedFolder){
    process.env.SHARED_FOLDER = program.sharedFolder;
}

if(program.readOnly){
    process.env.READ_ONLY = true;
}

if(program.forwardCommands){
    if(!program.sharedFolder) {
        console.log('Could not forward commands without specified shared folder (use --shared-folder <path> option)');
        return; //TODO:
    }
    serviceRouter.register() //TODO:
}

if(program.sharedFolder){
    serviceRouter.register() //TODO:
}


//Move to WebSocket logic part
io.on('connection', (socket) => {
    console.log('User connected');



    socket.on('message', (message) => {
        let data = JSON.parse(message);
        serviceRouter.call(data, (result) => socket.send(JSON.stringify(result)));
    });

    socket.on('disconnect', function(){
      console.log('User disconnected');
  });
});

const port = process.env.BACKEND_PORT || 65520;
server.listen(port, () => {
    console.log(`Remixd server started on port ${port}`)
});