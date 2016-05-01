const passport = require('passport')
const User = require('../models/user.js')
const config = require('../config.js')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Setup options for JWT Strategy
const jwtOptions = {
  // telling jwtStrategy where to look the jwt token in the request
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // use to decode the jwt token
  secretOrKey: config.secret
}

// Create JWT strategy
// cb fn will be call when ever user log in with jwt or when we need to authenticate with a jwt token
// payload is the decoded jwt token payload
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with the user object
  // otherwise, call done without a user object
  // payload.sub is the id that we send when we encode and return jwt
  User.findById(payload.sub, function (err, user) {
    // if err when search of user i.e. db failure then
    if (err) { return done(err, false) }

    if (user) { // if user is found
      done(null, user)
    } else {
      done(null, false) // this is for did a search but couldn't find a user
    }

  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)