"use strict"
// use to load env variable during development this is redundant for production deployment as it's taken care by docker
require('dotenv').config()

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const router = require('./router.js')
const morgan = require('morgan')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const cors = require('cors')
const passport = require('passport')
const app = express()
// DB Setup with fcc as the name of the database
// Lesson: Can't use native data type like true or false when access variable from process.env (everything is a string)
if (process.env.NODE_ENV === 'development') {
  mongoose.connect('mongodb://127.0.0.1:fcc/fcc')
  console.log('connecting to local development mongo')
} else {
  mongoose.connect('mongodb://mongodb:fcc/fcc')
}

// App setup

app.use(morgan('combined')) // logging incoming request
// lesson: must expose custom header when using cors and if you have custom headers
app.use(cors({
  exposedHeaders: ['access-token', 'expiry', 'uid']
})) // allow cross origin domain
app.use(bodyParser.json()) // parse incoming request to json
app.use(expressValidator())
app.use(passport.initialize())
router(app)

// server setup(talking to outside world)
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on port', port)