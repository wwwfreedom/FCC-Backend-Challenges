const mongoose = require('mongoose')

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

// Create the model class
// create a collection name user using the userSchema for each new documents
const ModelClass = mongoose.model('user', userSchema)

// Export the model
module.exports = ModelClass