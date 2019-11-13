const remixDClient = require('./remixDClient')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const ws = require('express-ws')
const WebSocket = require('ws')
const pluginWs = require('@remixproject/plugin-ws')

class Router {
  constructor () {
    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    process.env.CLIENT = remixDClient

    /*
    ws(app)
    const port = 65520;
    app.listen(port, () => console.log(`Remixd server started on port ${port}`));
    */

    const ws = new WebSocket.Server({ port: 65520 })
    console.log('Server running on port 65520')
    this.ws = ws

  }

  // Origin has to be in the list of whitelisted!
  static validateRequest (ws, request) {
    if (process.env.ORIGINS.indexOf(request.headers.origin) === -1) {
      throw new Error('CORS invalid!')
    }
  }
}
const router = new Router()

router.app.ws('/', async(socket) => {
  const client = pluginWs.createWebsocketClient(socket);
  await client.onload()
  await client.call('fileManager', 'setFile', 'browser/hello.txt', 'Hello world!')
})

router.ws.on('connection', (ws, request) => {
  try {
    const client = pluginWs.createWebsocketClient(ws);
    client.onload();
    client.call('fileManager', 'setFile', 'browser/hello.txt', 'Hello world!')

    Router.validateRequest(ws, request)
    ws.on('message', (message) => {
      console.log(`Received message ${message} from user ${client}`)
      const data = JSON.parse(message)
      remixDClient.call(data, (result) => {
        console.log(JSON.stringify(result))
        ws.send(JSON.stringify(result))
      })
    })
  } catch (err) {
    // TODO: Add global error handler here!
    ws.send(JSON.stringify(err.message))
  }
})

module.exports = Router
