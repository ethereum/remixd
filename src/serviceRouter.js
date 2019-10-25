let services = require('./services');

class ServiceRouter {

  constructor (services) {
    this.services = services || [];
  }

  register(service) {
    this.services.push(service);
  }

  call(message, send) {
    const { id, service, fn, args } = message;
    const instance = this.services[service]; 
    const func = instance[fn];
    try {
      func(args, (error, result) => {
        send({ id, scope: service, fn, error, result });
      })
    } catch (err) {
      const error = err.message;
      send({ id, scope: service, fn, error });
    }
  }
}

const serviceRouter = new ServiceRouter(services);
module.exports = serviceRouter;