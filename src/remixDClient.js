const services = require('./services')
const path = require('path')

class RemixDClient {

  // List of methods exposed by the client (required for error checking)
  constructor (services) {
    this.services = services || []
    this.sharedFolder = path.resolve(__dirname, '..', process.env.SHARED_FOLDER)
  }

  register (service) {
    this.services.push(service)
  }

  call (message, callback) {
    const {action, id, service, key, fn, args, name, payload} = message
    try {
      let svc
      if (service === 'sharedfolder') {
        svc = this.services[service]
        svc[fn](args, (error, data) => {
          let response = JSON.stringify({
            id: id,
            type: 'reply',
            scope: name,
            result: data,
            error: error
          })
          callback(response)
        })
      } else {
        let svc = this.services[name]
        svc.command(action, id, key, name, payload, (error, data) => {
          let response = JSON.stringify({
              id: id,
              type: 'reply',
              scope: name,
              result: data,
              error: error
            })
          callback(response)
        })
      }
    } catch (error) {
      //Unexpected error
      callback(JSON.stringify({
        id: id,
        type: 'reply',
        scope: name,
        error: error
      }))
      //callback({scope: name, key, error: error.message, result: null})
    }
  }
}

const remixDClient = new RemixDClient(services)
module.exports = remixDClient
