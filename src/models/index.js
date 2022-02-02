import mongoose from 'mongoose'
import { url } from '../../config/db.js'
import mongooseModel from './cutomer.model.js'
const db = {}
db.mongoose = mongoose
db.url = url
db.customers = mongooseModel

export default db
