const services = require('./services')
const path = require('path');

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
    const {action, id, service,  key, name, payload} = message
    try {
      let svc = this.services[name]

      if (service === 'sharedfolder') {
        svc = this.services[service]
        svc[key](payload, callback)
      } else {
        svc.command(action, id, key, name, payload, callback)
      }
    } catch (error) {
      callback({scope: name, key, error: error.message, result: null})
    }
  }
}

const remixDClient = new RemixDClient(services)
module.exports = remixDClient
