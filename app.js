if (process.env.NODE_ENV !== 'prod') {
  console.log('*** ENV=', process.env.NODE_ENV)
  require('dotenv').config()
}
const express = require('express')
const swaggerUI = require('swagger-ui-express')
const docs = require('./docs')
const handleErrors = require('./src/middleware/handleErrors')
const notFound = require('./src/middleware/notFound')

const app = express()

// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()) /* bodyParser.json() is deprecated */

// OpenApi
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) /* bodyParser.urlencoded() is deprecated */

const db = require('./src/models')

console.log('db.clusterUri', db.clusterUri)

db.mongoose
  .connect(db.clusterUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: (process.env.NODE_ENV === 'test') ? 5000 : 30000,
    heartbeatFrequencyMS: (process.env.NODE_ENV === 'test') ? 5000 : 30000
  })
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch(err => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

// simple testing route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MrKnight application.' })
})

// Add Customer Routes
require('./src/routes/customer.routes')(app)
// Add Notes Routes
require('./src/routes/note.routes')(app)
// Add User Routes
require('./src/routes/user.routes')(app)
// Add Login Routes
require('./src/routes/login.routes')(app)

// not Fund 404
app.use(notFound)

// Add handleErrors
app.use(handleErrors)

// set port, listen for requests

const PORT = process.env.NODE_DOCKER_PORT || 3000
let server
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
} else {
  server = app.listen(() => {
    console.log('Server is running')
  })
}

process.on('uncaughtException', err => {
  console.warn('OOOPS! Unhandled ERROR', err.message)
  console.warn('Maybe you should try/catch the operation?')
  console.log(err)
})

process.on('unhandledRejection', err => {
  console.warn('OOOPS! Unhandled Promise rejection', err.message)
  console.log(err)
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  db.mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination')
    process.exit(0)
  })
})

module.exports = { app, server }
