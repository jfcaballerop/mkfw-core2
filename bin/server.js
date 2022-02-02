import { config } from 'dotenv'
import app from '../app'
config()

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
