const remixDClient = require('./remixDClient')
const bodyParser = require('body-parser')
const app = require('express')()
const WebSocket = require('ws')

class Router {
  constructor () {
    // Middleware
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    process.env.CLIENT = remixDClient

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

router.ws.on('connection', function connection (ws, request, client) {
  try {
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
