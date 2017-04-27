const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/blog')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

module.exports = Schema