const Facade = require('../../lib/facade');
const tripSchema = require('./schema').tripSchema;

class DriversFacade extends Facade {}

module.exports = new DriversFacade('Trips', tripSchema);
