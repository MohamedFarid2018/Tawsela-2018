var express = require('express');
var path =  require('path').join(__dirname,'../public/html/sign_up.html');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile(path, { "Content-Type": "text/html" });
});

module.exports = router;