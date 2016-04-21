"use strict"
var moment = require('moment')
var parser = require('ua-parser-js')
var isURL = require('validator/lib/isURL')

module.exports = function (app) {
  app.get('/api', function (req, res) {
    res.send({hi: 'yolo'})
  })

  // timestamp route for timestamp challenge
  app.get('/api/timestamp*', function (req, res) {
    // set the valid date format
    let dateFormats = ['MM-DD-YYYY', 'DD-MM-YYYY', 'MMMM-DD-YYYY', 'x', 'X']
    // parse userInput into a moment date object in accordance to date formats
    let date = moment(req.params[0].substring(1), dateFormats)
    // check if date is valid using isValid moment method
    if (date.isValid()) {
      // response with the unix and natural time format
      res.send({
        unix: moment(date).format('X'),
        natural: moment(date).format('MMMM D, YYYY')
      })
    } else {
      res.send({
        unix: null,
        natural: null
      })
    }
  })

  // code for header parser challenge
  app.get('/api/whoami', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // using user agent parser to parse out the details of the user-agent property
    var operatingSystem = parser(req.headers['user-agent']).os.name
    // parsing the language of the user
    var language = req.headers['accept-language'].split(',')[0]
    res.send({
      ipaddress: ip,
      language: language,
      software: operatingSystem
    })
  })

  app.get('/api/url*', function (req, res) {
    let url = req.params[0].substring(1)
    // use validator library to check if email is valid
    if (isURL(url)) {
      res.send(url)
    } else {
      res.send({
        error: "Wrong url format, make sure you have a valid protocol and real site."
      })
    }
  })
}