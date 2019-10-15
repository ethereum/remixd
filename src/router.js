var Websocket = require('./websocket')

class Router {
  constructor (port, services, opt) {
    this.opt = opt
    this.port = port
    this.services = services
  }

  start() {
    var websocket = new Websocket(this.port, this.opt)
    this.websocket = websocket
    this.websocket.start((message) => {
      this.call(message.id, message.service, message.fn, message.args)
    })
    Object.keys(this.services).forEach(key => {
      this.services[key].init(this.websocket)
    })
    return function () {
      if (websocket) {
        websocket.close()
      }
    }
  }

  call(callid, name, fn, args) {
    try {
      var service = this.services[name];
      service[fn](args, (error, data) => {
        var response = {
          id: callid,
          type: 'reply',
          scope: name,
          result: data,
          error: error
        }
        this.websocket.send(JSON.stringify(response))
      })
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', '[ERR] ' + msg)
      if (this.websocket) {
        const msg = 'Unexpected error: ' + e.message
        this.websocket.send(JSON.stringify({
          id: callid,
          type: 'reply',
          scope: name,
          error: msg
        }))
      }
    }
  }
}

module.exports = Router
