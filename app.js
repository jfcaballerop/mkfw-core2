if (process.env.NODE_ENV !== 'prod') {
  console.log('*** ENV=', process.env.NODE_ENV)
  require('dotenv').config()
}
const express = require('express')
const swaggerUI = require('swagger-ui-express')
const docs = require('./docs')

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
    useUnifiedTopology: true
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

module.exports = app
