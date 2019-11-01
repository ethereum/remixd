#!/usr/bin/env node
const path = require('path');
const app = require('express')();
const ws = require('express-ws')(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(cors({origin: true}));
app.options('*', cors());

const options = {
    path : path.resolve(process.cwd(), '.env')
};
dotenv.config(options);

const remixDClient = require('../src/remixDClient');

process.env.PERMISSIONS = ["READ", "WRITE"];
process.env.CLIENT = remixDClient;

app.use((req, res, next) => {
    console.log("Testing");
    return next();
});

app.get('/', (req, res) => {
    console.log("Loaded");
});

//This needs to be moved into routing part which will be @remixproject/plugin-ws
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
            //TODO: Add global error handler here!
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