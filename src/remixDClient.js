// const RemixClient = require('@remixproject/plugin-ws')

const services = require('./services')

// Client that connect to Remix IDE (or any IDE that supports remix engine)
// class RemixDClient extends RemixClient {
class RemixDClient {
  // List of methods exposed by the client (required for error checking)
  constructor (services) {
    this.services = services || []
  }

  register (service) {
    this.services.push(service)
  }

  validatePermissions (permissions) {
    if (permissions.length === 0) {
      return
    }

    const permissionsEnabled = process.env.PERMISSIONS.split(',')

    permissions.forEach(permission => {
      if (permissionsEnabled.indexOf(permission) === -1) {
        throw new Error('Insufficient permissions')
      }
    })
  }

  call (message, send) {
    const { service, fn, args, permissions } = message
    try {
      //this.validatePermissions(permissions) //For checking and requesting needed permissions from users
      const func = this.services[service][fn]
      func(args, (error, result) => {
        send({ scope: service, fn, error, result })
      })
    } catch (error) {
      send({ scope: service, fn, error: error.message, result: null })
    }
  }
}

const remixDClient = new RemixDClient(services)
module.exports = remixDClient
