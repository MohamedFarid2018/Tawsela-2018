const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    tId:{type:String,required:true,trim:true},
    pId:{type:String,required:true,trim:true},
    dId:{type:String,required:true,trim:true},
    pslat: { type: String, trim:true, default:'' },
    pslong: { type: String, trim:true, deautlt:''},
    dlat: { type: String, trim:true, default:'' },
    dlong: { type: String, trim:true, deautlt:''},
    tripDate:{type: Date, deautlt:0},
    tripCost:{type:Number, default:0},
    pRate:{type:Number, default:0},
    dRate:{type:Number, default:0},
    tripDistance:{type:Number, default:0},
    tripWaitedTime:{type: Number, default:0}
});

const Trip = mongoose.model('trip',tripSchema);
module.exports.TripSchema = tripSchema;
module.exports.Trip = Trip;