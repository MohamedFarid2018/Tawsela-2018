const router = require('express').Router();
const jwt = require('jsonwebtoken');
const online = require('../model/drivers/schema').onlineDriver;
router.post('/',function(req, res){
    console.log(req.body);
    var token = jwt.verify(req.body.token, 'Garry Kasparov');
    console.log(token);
    if(req.body.status === 'accept'){
        online.find({'passengerId':token.Id},'slat slong',function(err, pos){
            console.log(pos);
            if(err){
                console.log('Ops you missed to combine driver&passenger');
                res.status(200).json({slat:0,slong:0});
            }else{
                //if the user didn't confirm the driver will be always pending and won't get any requests
                online.findOneAndUpdate({'_id':pos[0]._id},{'status':false,'pending':false},{new:true},function(err, updated){
                    if(err){
                        console.log('Error Confirming the user Request');
                        res.status(301).json({slat:0,slong:0});
                    }else{
                        console.log(updated);
                        res.status(200).json({slat:updated.slat, slong:updated.slong});
                    }
                });
            }
    });
    }else if(req.body.status === 'reject'){
        online.find({'passengerId':token.Id},'_id',function(err, Id){
            if(err){
                console.log(err.message);
                console.log('Ops you missed to combine driver&passenger');
                res.status(301).json({slat:0,slong:0});
            }else{
                online.findOneAndUpdate({'_id':Id[0]._id},{'passengerId':'','pending':false,dlong:0, dlat:0,dist:0},{new: true},
                function(err, updated){
                    if(err){
                        console.log(err.message);
                        console.log('Error while detaching the driver passenger');
                        res.status(500).json({slong:0, slat:0});
                    }else{
                        console.log(updated);
                        res.status(200).json({slat:0,slong:0});
                    }
                });
            }


        });
    }else{
        console.log("The Status Value does not match");
        res.json({slong:0,slat:0});
    }
});
module.exports = router;