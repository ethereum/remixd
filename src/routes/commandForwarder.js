let helpers = require('../services/helpers');
let commandForwarderSvc = require('../services/commandForwarder');

function forward(json){
    helpers.validateCommand(json);
    commandForwarderSvc.forward(json);
}

module.exports = {
    forward
}