const mongoose = require('mongoose')

const urls = new mongoose.Schema({
  url:String,
  click:Number,
  key:String
})

module.exports = mongoose.model('url', urls)