const Facade = require('../../lib/facade');
const passengerSchema = require('./schema').passengerSchema;

class PassengersFacade extends Facade {}

module.exports = new PassengersFacade('Passengers', passengerSchema);
