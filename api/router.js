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
const path = require('path')
const _ = require('lodash')
const fs = require('fs')

const Authentication = require('./controllers/authentication')
const passportService = require('./services/passport.js')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

const multer  = require('multer')
const storage = multer.diskStorage({
  // note if you pass destination a function then you must manually create the folder, when passing destination a string make sure that the folder doesn't already exist otherwise it will throw error
  destination: './tmp/uploads',
  filename: function (req, file, cb) {
    // in this case we're not making the name unique becasue we'll delete them staight away but in other case it's advise to make it unique
    cb(null, file.originalname)
  }
})

// adding option to multer, limit file size and file types
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*100,
    files: 1
  },
  // // example of limiting file type
  // fileFilter: function (req, file, next) {
  //   var ext = path.extname(file.originalname);

  //   // if file is txt then carry on as usual
  //   if(_.indexOf(['.txt'], ext) !== -1) {
  //       return next(null, true);
  //   }
  //   // if not then pass make a new error object and pass it down to error handler
  //   let err = new Error('Wrong file type!')
  //   err.code = 403
  //   next(err);
  // }
})

module.exports = function (app) {
  app.get('/api', requireAuth, function (req, res) {
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
    res.send('<form action="/api/fileupload" enctype="multipart/form-data" method="post" > <input type="file" name="yolo" required> <input type="submit" value="upload"> </form>')
  })

  app.post('/api/fileupload', upload.single('yolo'), (req, res, next) => {
    // delete the file after upload
    fs.unlink(`./tmp/uploads/${req.file.filename}`, (err) => {
      if (err) console.log(new Error('could not delete temporary upload folder'))
    })
    res.json({
      filesize: `${req.file.size} bytes`
    })
  })

  app.post('/api/signin', Authentication.signin)

  app.post('/api/signup', Authentication.signup)

  // last stop to handle errors in the all of the above routes
  app.use(function(err, req, res, next) {
    if (err.code === 'LIMIT_FILE_SIZE' || err.code === 403) {
      res.status(403).send('This is only a demontration of a file upload api on a tiny server. Please upload a file smaller than 100kb.')
    } else {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    }
  })
}