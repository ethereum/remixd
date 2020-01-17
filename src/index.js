'use strict'

module.exports = {
  Router: require('./router'),
  services: {
    sharedFolder: require('./services/sharedFolder'),
    git: require('./services/git')
  }
}
