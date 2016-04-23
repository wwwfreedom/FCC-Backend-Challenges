"use strict"
const moment = require('moment')
const parser = require('ua-parser-js')
const isURL = require('validator/lib/isURL')
const axios = require('axios')
const urlApi = 'https://www.googleapis.com/urlshortener/v1/url/'
const googleApiKey = process.env.GOOGLE_URL_SHORTENER_API_KEY
const imgurApiKey = `Client-ID ${process.env.IMGUR_API_KEY}`
const imgurUrl = 'https://api.imgur.com/3/gallery/search/'
const RecentSearch = require('./models/recentImgSearch.js')

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
    let originalUrl = req.params[0].substring(1)
    // set data for posting to google shorterner api
    let data = { longUrl: originalUrl }
    // set option configs for axios
    let params = { params: { key: googleApiKey }}
    // use validator library to check if email is valid
    if (isURL(originalUrl)) {
      // call the api
      axios.post(urlApi, data, params)
      .then(response => res.send({
        'original URL': originalUrl,
        'short URL': response.data.id
      }))
      .catch((response) => console.log(response))
    } else {
      res.send({
        error: "Wrong url format, make sure you have a valid protocol and real site."
      })
    }
  })

  // code for image search abstraction layer challenge
  app.get('/api/imgsearch*', function (req, res) {
    let searchTerm = req.params[0].substring(1)
    let pageNum = req.query.offset
    let config = {
      headers: { Authorization: imgurApiKey },
      params: {
        q: `title: ${searchTerm}`,
        page: pageNum || 1
      }
    }

    axios.get(imgurUrl, config)
    .then((response) => {
      let imgArr = response.data.data.map((img) => {
        return {
          url: img.link,
          alt_text: img.title
        }
      })

      // create and save the search term using RecentSearch model
      const search = new RecentSearch({
        searchTerm: searchTerm,
        time: new Date().toString()
      })

      search.save((err) => {
        if (err) { throw new Error('could not save to db')}
        res.send(imgArr)
      })
    })
    .catch((response) => console.log(response))
  })

  // find the most recent 10 searchs in the database
  app.get('/api/latest/imgsearch', (req, res) => {
    let recentSearches = RecentSearch.find({}, (err, searches) => {
      if (err) {throw err}
      // transform the search result to exclude the mongo fields
      let modRecentSearches = searches.map((search) => ({
        searchTerm: search.searchTerm,
        time: search.time
      }))
      // return the search found as json to the user
      res.json(modRecentSearches)
    }).limit(10).sort({ time: -1})
  })

  // code for fileMetadata upload microservice challenge

  app.get('/api/fileMetadata', (req, res) => {
    res.send('<form action="/api/fileupload" method="post" > <input type="file"> <input type="submit"> </form>')
  })

  app.post('/api/fileupload', (req, res) => {
    console.log(req)
    res.send('formaway')
  })
}