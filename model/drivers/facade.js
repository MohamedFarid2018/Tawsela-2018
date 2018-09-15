const Facade = require('../../lib/facade');
const driverSchema = require('./schema').driverSchema;

class DriversFacade extends Facade {}

module.exports = new DriversFacade('Drivers', driverSchema);
