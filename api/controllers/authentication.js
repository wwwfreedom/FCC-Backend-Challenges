const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../config.js')
const passport = require('passport')
const moment = require('moment')

function tokenForUser(user, expiresIn) {
  const payload = {
    iat: Date.now(), // issue time
    iss: 'Kevin', // issuer 'put the website name here'
    sub: user.id // convention sub = subject
  }
  return jwt.sign(payload, config.secret, { expiresIn }) // expiresIn uses seconds
}

exports.signin = function(req, res, next) {
  // User has already had their email and password authenticated
  // we just need to give them a token
  // req.user is pass in from the passport local middleware strategy as part of returning done(null, user) in the passport.js
  // todo: can make the expiry date default to 1 day and 7 days if user tick the remember me during login by having client send extra property remember me for 7 days as true, we then detect that in the request body and change the expiry date.
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(400).send({ errors: ["Invalid login credentials. Please try again."] } )}
    const resHeader = {
      'access-token': tokenForUser(user, '1 day'),
      client: 'test',
      expiry: moment().add(1, 'd').format('X'),
      uid: 'test@test.com'
    }
    res.status(200).header(resHeader).send({
      data: {
        uid: user.id,
        provider: 'email'
      }
    })
  })(req, res, next) // passing req, res, next into passport authenticate making it available for our custom callback
}


exports.signup = function (req, res, next) {
  // validation and sanitization of user input
  // checkbody is a method from express-validator library and it only check the body of the request fn signature (fields, errorMessage)
  req.checkBody('email', 'Valid email is required').notEmpty()
    .isEmail().withMessage('Invalid email')
  // withMessage is use for individual errors
  req.checkBody('password', 'Password is required').notEmpty()
    .len(4, 30).withMessage('Password must be between 4 & 30 characters long')
  // normalizeEmail is method from validator library which is a key dependency of express-validator.
  req.sanitize('email').normalizeEmail({ lowercase: true, remove_dost: false })

  const errors = req.validationErrors()

  // if validation error return errors to user
  if (errors) {
    return res.status(422).send({ errors: errors.map((error) => error.msg)})
  }

  const email = req.body.email
  const password = req.body.password

  // Step 1: see if a user with the given email exits
  // User here is a class of users, the entire collection of users save in db
  User.findOne({ email }, (err, existingUser) => {
    // if something went wrong during db lookup pass err down
    if (err) { return next(err) }
    // Step 2: if a user with email does exist return an error
    if (existingUser) {
      return res.status(422).send({error: 'Email is in use'})
    }
    // Step 3: If a user with email does NOT exist, create and save user record
    // make a new user
    const user = new User({ email, password })
    // save user to db
    user.save((err) => {
      if (err) { return next(err)}
      // Respond to request indicating the user was created
      res.send({ token: tokenForUser(user, '1 day') })
    })
  })
}