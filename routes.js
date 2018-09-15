var fs = require('fs');
const express = require('express');
const Router = require('express').Router;
const router = new Router();
const passengers = require('./model/passengers/router');
const drivers = require('./model/drivers/router');
const index = require('./routes/index');
const users = require('./routes/users');
const Driver = require('./routes/match');
const goOnline = require('./routes/goOnline');
const login = require('./routes/login');
const logout = require('./routes/logout');
const signup = require('./routes/signup');
const calc = require('./routes/calc');
const confirm = require('./routes/confirm');
const ok = require('./routes/ok');
const Trying = require('./routes/trying');
const changePassword = require('./routes/changePassword');
const forgetPassword = require('./routes/forgetPassword');
var check = require('./routes/check');
////////////////website
const home = require('./routes/home');
const becomeadriver = require('./routes/Become A Driver');
const drive = require('./routes/Drive');
const ride = require('./routes/Ride');
const sign_up = require('./routes/websignup');
const profile = require('./routes/profile')
const updateProfile = require('./routes/updateProfile');
const trips = require('./routes/trips');


router.route('/').get((req, res) => {
    res.json({ message: 'Welcome to full-app-restapi API!' });
});

// router.use('/message',message);
//router.use('/trying',trying)
router.use('/updateProfile',updateProfile);
router.use('/profile',profile);
router.use('/changePassword', changePassword);
router.use('/forgetPassword', forgetPassword);
router.use('/signup', signup);
router.use('/login', login);
router.use('/goOnline',goOnline);
router.use('/confirm',confirm);
router.use('/passengers', passengers);
router.use('/drivers', drivers);
router.use('/users', users);
router.use('/index', index);
router.use('/ride', ride);
router.use('/logout', logout);
router.use('/calc', calc);
router.use('/ok', ok);
router.use('/check', check);
router.use('/trips', trips);
///////////////////////////web
router.use('/twsela.com', home);
router.use('/ride.com', ride);
router.use('/drive.com', drive);
router.use('/becomeadriver.com', becomeadriver);
router.use('/sign_up.com', sign_up);


// router.use('', javascript);
// router.use('image', image );


// catch 404 and forward to error handler
router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




module.exports = router;