var express = require('express');
var path = __dirname + '/public/html/Home.html';
var router = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile(path, { "Content-Type": "text/html" });
});

module.exports = router;