const remixDClient = require('./remixDClient')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
require('express-ws')(app)
const pluginWs = require('@remixproject/plugin-ws')
const {validateRequest} = require('./utils/utils')
const {boolean} = require('boolean')

class Router {
    constructor() {
        // Middleware
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

        // TODO: Remove this after remix-plugin has been done
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

        socket.on('message', (msg) => {
            console.log(`Received message ${msg} from user ${socket}`)
            try {
                const message = JSON.parse(msg)
                // TODO: remove once remix-plugin has been implemented
                if (process.env.SHARED_FOLDER && remixDClient.services['sharedfolder'].websocket === null) {
                    remixDClient.services['sharedfolder'].setWebSocket(socket)
                    remixDClient.services['sharedfolder'].setupNotifications(process.env.SHARED_FOLDER)
                    remixDClient.services['sharedfolder'].sharedFolder(process.env.SHARED_FOLDER, boolean(process.env.READ_ONLY) || false)
                }

                remixDClient.call(message, (response) => {
                    console.log(response)
                    socket.send(response)
                })
            } catch (err) {
                socket.send(err) //Handle when invalid JSON input is send!
            }
        })
    } catch (err) {
        socket.send(socketErrorHandler(err))
    }
})

module.exports = Router
