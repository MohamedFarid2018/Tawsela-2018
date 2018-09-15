const Controller = require('../../lib/controller');
const driversFacade = require('./facade');

class DriversController extends Controller {}

module.exports = new DriversController(driversFacade);
