const remixDClient = require('./remixDClient')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
require('express-ws')(app)
const pluginWs = require('@remixproject/plugin-ws')
const {validateRequest} = require('./utils/utils')

const socketErrorHandler = (err) => JSON.stringify({type: 'error', message: err.toString()})

class Router {
  constructor () {
    // Middleware
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    const port = process.env.PORT || 65520

    app.listen(port, () => console.log(`Server started on port ${port}`))

    this.app = app
  }
}

const router = new Router()

router.app.use(function (req, res, next) {
  try {
    validateRequest(req)
  } catch (e) {
    return res.send(JSON.stringify(e))
  }
  return next()
})

router.app.ws('/', async (socket) => {
  try {

    /*
    const client = pluginWs.createWebsocketClient(socket)
    await client.onload()
    await client.call('fileManager', 'getFile', 'browser/test.txt', 'Hello World')
    */

    socket.on('message', (message) => {
      console.log(`Received message ${message} from user ${socket}`)
      try {
        const data = JSON.parse(message)
        remixDClient.call(data, (result) => {
          console.log(JSON.stringify(result))
          socket.send(JSON.stringify(result))
        })
      } catch (err) {
        socket.send(socketErrorHandler(err)) //Handle when invalid JSON input is send!
      }
    })
  } catch (err) {
    socket.send(socketErrorHandler(err))
  }
})

module.exports = Router
