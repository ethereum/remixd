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
    const {action, id, key, name, payload} = message
    try {
      const svc = this.services[name]

      if (name === 'fileManager') {
        svc[key](payload, callback)
      } else {
        this.services["fileManager"]["createFolder"](this.sharedFolder) //Create folder if it doesn't exist
        svc.command(action, id, key, name, payload, callback)
      }
    } catch (error) {
      callback({scope: name, key, error: error.message, result: null})
    }
  }
}

const remixDClient = new RemixDClient(services)
module.exports = remixDClient
