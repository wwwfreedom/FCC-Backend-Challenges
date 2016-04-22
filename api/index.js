"use strict"
// use to load env variable during development this is redundant for production deployment as it's taken care by docker
require('dotenv').config()

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const router = require('./router.js')
const morgan = require('morgan')
const mongoose = require('mongoose')

// DB Setup with fcc as the name of the database
if (process.env.DEVELOPMENT === true) {
  mongoose.connect('mongodb://127.0.0.1:fcc/fcc')
  console.log('connecting to local development mongo')
} else {
  mongoose.connect('mongodb://mongodb:fcc/fcc')
}

const app = express()
app.use(morgan('combined'))
router(app)

const port = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on port', port)