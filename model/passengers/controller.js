const Controller = require('../../lib/controller');
const passengersFacade = require('./facade');

class PassengersController extends Controller {}

module.exports = new PassengersController(passengersFacade);
