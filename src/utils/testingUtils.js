const supertest = require('supertest')
const { v4: uuidv4 } = require('uuid')
const { app, server } = require('../../app')
const User = require('../../src/models/user.model')
const db = require('../../src/models')

const api = supertest(app)

const createRandomUserCustomer = () => {
  let user = {
    userName: 'test',
    name: {
      firstName: 'test',
      lastName: 'test'
    },
    description: 'DESC test',
    active: true,
    city: 'City gtest',
    country: 'Country test',
    phone: [
      'test'
    ]
  }
  user = {
    ...user,
    userName: 'test' + Math.floor(Math.random() * 10000)
  }

  return user
}

const createRandomNote = (id) => {
  const note = {
    title: uuidv4(),
    content: 'TEst note',
    date: new Date(),
    important: false,
    userId: id
  }

  return note
}

const createRandomUser = () => {
  const user = {
    username: uuidv4(),
    name: '',
    passwordHash: 'asdadasdadad',
    notes: []
  }

  return user
}

const getUsers = async (user) => {
  let usersDB
  if (user) {
    usersDB = await User.find({ user })
  } else {
    usersDB = await User.find({})
  }
  return usersDB.map(user => user.toJSON())
}
const closingTestConnections = async () => {
  await server.close()
  // Closing the DB connection allows Jest to exit successfully.
  await db.mongoose.connection.close()
}

module.exports = {
  createRandomUserCustomer,
  createRandomNote,
  createRandomUser,
  api,
  getUsers,
  closingTestConnections
}
