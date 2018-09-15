const Controller = require('../../lib/controller');
const tripsFacade = require('./facade');

class DriversController extends Controller {}

module.exports = new DriversController(tripsFacade);
