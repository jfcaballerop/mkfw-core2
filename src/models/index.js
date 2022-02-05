const dbConfig = require('../../config/db.js')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.clusterUri = dbConfig.clusterUri
db.customers = require('./cutomer.model.js')
db.notes = require('./note.model')

module.exports = db
