#!/usr/bin/env node
const path = require('path');
const app = require('express')();
const ws = require('express-ws')(app);
const cors = require('cors');
//const server = require('http').createServer(app)
//const io = require('socket.io')(server)
const bodyParser = require('body-parser');
const dotenv = require('dotenv');


// Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors({origin: true}));
app.options('*', cors());

//Commander part
let program = require('commander');

program
    .usage('[options]')
    .description('Provide a two-way connection between the local computer and Remix IDE')
    .option('--remix-ide  <url>', 'URL of remix instance allowed to connect to this web socket connection', 'https://remix.ethereum.org')
    .option('-s, --shared-folder <path>', 'Folder to share with Remix IDE')
    .option('--read-only', 'Treat shared folder as read-only (experimental)')
    .option('--forward-commands', 'Enables CLI commands forwarding')
    .on('--help', function () {
        console.log('\nExample:\n\n    remixd -s ./ --remix-ide http://localhost:8080\n')
    }).parse(process.argv)

console.log('\x1b[33m%s\x1b[0m', '[WARN] You may now only use IDE at ' + program.remixIde + ' to connect to this instance')

//TODO:
const remixDClient = require('../src/remixDClient');

process.env.PERMISSIONS = ["READ", "WRITE"];
process.env.CLIENT = remixDClient;
if (program.remixIde) {
    process.env.URL = program.remixIde;
}

if (program.sharedFolder) {
    process.env.SHARED_FOLDER = program.sharedFolder;
}

if (program.readOnly) {
    process.env.READ_ONLY = true;
}

app.use((req, res, next) => {
    console.log("Testing");
    return next();
});

//This needs to be moved into routing part which will be @remixws-plugin
app.get('/', (req, res) => {
    console.log("Loaded");
});

app.ws('/', (socket, req) => {
    console.log('User connected');

    socket.on('message', (message) => {
        try {
            let data = JSON.parse(message);
            remixDClient.call(data, (result) => {
                console.log(JSON.stringify(result));
                socket.send(JSON.stringify(result));
            });
        } catch (err){
            socket.send(JSON.stringify(err.message));
        }
    });

    socket.on('disconnect', function () {
        console.log('User disconnected');
    });
});

const port = process.env.BACKEND_PORT || 65520;
app.listen(port, () => {
    console.log(`Remixd server started on port ${port}`)
});