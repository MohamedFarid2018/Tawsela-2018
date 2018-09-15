const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const passengerSchema = new Schema({
    Id:{type:String,required:true,trim:true},
    fname: { type: String, trim:true, default:'' },
    lname: { type: String, trim:true, deautlt:''},
    email: {type:String,unique: true,required:true,trim:true},
    phone:{type: String,unique: true,required:true,trim:true},
    password:{type:String},
    token:{type:String},
    city:{type: String,trim:true},
    date:{type: Date},
    rate:{type:Number},
    resetCode:{type:Number},
    temporaryDate:{type: Date},
    numOfTrips:{type:Number, default:0 }
    //photo: { data: Buffer, contentType: String }
});

const passengerTripSchema = new Schema({
    tId:{type:String,required:true,trim:true},
    pId:{type:String,required:true,trim:true},
    dId:{type:String,required:true,trim:true},
    pslat: { type: String, trim:true, default:'' },
    pslong: { type: String, trim:true, deautlt:''},
    dlat: { type: String, trim:true, default:'' },
    dlong: { type: String, trim:true, deautlt:''},
    tripDate:{type: Date},
    tripWaitedTime:{type: Date},
    tripCost:{type:Number, default:0},
    pRate:{type:Number},
    dRate:{type:Number},
    tripDistance:{type:Number}
});

const Passenger = mongoose.model('passenger',passengerSchema);
const PassengerTrip = mongoose.model('PassengerTrip',passengerTripSchema);

module.exports.passengerSchema = passengerSchema;
module.exports.passengerTripSchema = passengerTripSchema;

module.exports.Passenger = Passenger;
module.exports.PassengerTrip = PassengerTrip;