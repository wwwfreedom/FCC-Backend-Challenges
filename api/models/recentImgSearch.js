const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define the recent search model
const recentSearchSchema = new Schema({
  searchTerm: String,
  time: { type: String, unique: true }
})

// create the modle class
const RecentSearchModel = mongoose.model('recentSearch', recentSearchSchema)

module.exports = RecentSearchModel