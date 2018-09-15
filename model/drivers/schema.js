const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    Id:{type:String,required:true,trim:true},
    fname: { type: String, trim:true ,default: '' },
    lname: { type: String, trim:true, default: '' },
    email: {type:String,unique: true,required:true, trim:true},
    phone:{type: String,unique: true, required:true, trim:true},
    password:{type:String,required:true},
    token:{type:String},
    city:{type: String,trim:true},
    rate:{type:Number, default:0},
    //age:{type:Number},
    // photo:{type: Binary},
    // carId: {type:String, trim:true,default:'',required:true},
    platenumber:{type:String, trim: true,default:''/*,unique:true*/},
    type:{type:String, trim:true,default:''},//type
    model:{type:String, trim:true,default:''},
    color:{type:String, trim:true,default:'red'},
    pending:{type:Boolean,default:true},
    date:{type: Date},
    resetCode:{type:Number},
    temporaryDate:{type: Date},
    numOfTrips:{type:Number, default:0}
    //photo: { data: Buffer, contentType: String }
});

const carSchema = new Schema({
    driverId:{type:String,required:true},
    carId: {type:String, trim:true,default:'',required:true},
    platenumber:{type:String, trim: true,default:''/*,unique:true*/},
    carName:{type:String, trim:true,default:''},//type
    model:{type:String, trim:true,default:''},
    color:{type:String, trim:true,default:'red'},
    // photo:{}
});

const onlineSchema = new Schema({

    dsocketId:{type:String, required:true},
    driverId:{type:String,required:true,unique:true},
    slong:{type:Number,required:true},
    slat:{type:Number,required:true},
    status:{type:Boolean,default:true},//true for empty driver
    //the driver is requested from another user but the user response didn't confirmed yet
    pending:{type:Boolean,default:false},
    dist:{type:Number,default:0},
    dlong:{type:Number,default:0},
    dlat:{type:Number,default:0},
    waitingTime:{type: String,default:"2018-04-30 19:27:36.387Z"},

    psocketId:{type:String,default:''},
    passengerId:{type:String,default:''},
    pslong:{type:Number,default:0},
    pslat:{type:Number,default:0},
    etime:{type:Number, default:0},
    edistance:{type:Number, default:0}

});



const Driver = mongoose.model('driver',driverSchema);
const Car = mongoose.model('car',carSchema);
const onlineDriver = mongoose.model('online', onlineSchema);

module.exports.driverSchema = driverSchema;
module.exports.carSchema = carSchema;
module.exports.onlineSchema = onlineSchema;

module.exports.Driver = Driver;
module.exports.Car = Car;
module.exports.onlineDriver = onlineDriver;
