"use strict"
require('dotenv').config();

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const router = require('./router.js')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
router(app)

const port = process.env.PORT || 3000
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on port', port)