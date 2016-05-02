const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

// Define user model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  google: String,
  github: String,

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
}, { timestamps: true })

/**
 * Password hash middleware (encrypt password)
 * the pre here means before saving this model run this function
 */
// lesson: the top most function can't be arrow function if you want to use 'this'
 userSchema.pre('save', function (next) {
  // get access to user model
  const user = this
  // step 1: generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }

    // step 2: hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err) }
      // overwrite plain text password with encrypted password
      user.password = hash
      // call next to proceed and save the model
      next()
    })
  })
 })

 userSchema.methods.comparePassword = function (candidatePassword, callback) {
  // this is a reference to user model, this.password is our hash + salt password
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err) }

    callback(null, isMatch)
   })
 }

// Create the model class
// create a collection name user using the userSchema for each new documents
const ModelClass = mongoose.model('user', userSchema)

// Export the model
module.exports = ModelClass