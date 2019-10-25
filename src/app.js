let app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')
const router = require('./routes/index');
const ErrorHandler = require('./errors/errors');
const { setupRouter, setupWebSocket } = require('./services/helpers')
const path = require('path');
const dotenv = require('dotenv');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Move to router
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

console.log(process.env.NODE_ENV);
let options = {};
options.path = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config(options);
console.log("Working directory:" + process.env.SHARED_FOLDER);

//TODO: 
//setupRouter();
//setupWebSocket();

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

const port = process.env.BACKEND_PORT || 65520
server.listen(port)
console.log('server started on port', port)
