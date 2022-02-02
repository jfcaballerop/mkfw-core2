require('dotenv').config()
const app = require('../app')
const { mongoose } = require('../src/models')

// set port, listen for requests
const PORT = (process.env.NODE_ENV === 'test') ? process.env.NODE_TEST_LOCAL_PORT : process.env.NODE_DOCKER_PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

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
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination')
    process.exit(0)
  })
})
