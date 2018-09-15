const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Driver = require('../model/drivers/schema').Driver;

router.post('/',function(req, res){
    someDate = new Date();
    someDate.setDate(someDate.getDate() + 2);
    someDate.setHours(someDate.getHours() + 2);
    console.log((someDate.getDate()) + "/" + (someDate.getMonth()+1) + "/" + (someDate.getFullYear()));
    var rDate = (someDate.getDate()) + "/" + (someDate.getMonth()+1) + "/" + (someDate.getFullYear())
    res.status(200).json({message:"valid",date:rDate});

});


module.exports = router;

// try{
//     var token = jwt.verify(req.body.token,'Garry Kasparov');
// }catch(err){
//     console.log("Invalid Token");
//     res.status(409).json({message:"Invalid Token"});
// }

// Driver.find({"Id":token.Id},'Id',function(err,driver){
//     if (err || !driver.length){
//         console.log(err.message);
//         res.status(500).json({message:"Internal Server  Error"});
//     }else {
//         Driver.findById({"_id":driver[0]._id},'date',function(err,update){
//             console.log(update);
//             if(err)
//             {
//                 console.log(err.message);
//                 res.status(409).json({message:"invalid"});
//             }else{
//                 var someDate = update.date;
//                 someDate.setDate(someDate.getDate() + 2);
//                 someDate.setHours(someDate.getHours() + 2);
//                 console.log(update);
//                 console.log(someDate);
//                 res.status(200).json({message:"valid",date:someDate});
//             }
//         })
//     }
// } )