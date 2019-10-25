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

let options = {};
options.path = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config(options);

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