const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const bluebird = require('bluebird')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const app = express();
const http = require('http').Server(app);
const config = require('./config')
const fs = require('fs')
const routes = require('./routes')
const logger = morgan('combined')






// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))

mongoose.Promise = bluebird
mongoose.connect(config.mongo.url);

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(morgan('combined'))
    //  create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('tiny', { stream: accessLogStream }))

app.use('/', routes)

module.exports = app;

app.listen(config.server.port, () => {
    console.log(`Magic happens on port ${config.server.port}`)
});



