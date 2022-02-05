const { v4: uuidv4 } = require('uuid')

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

const createRandomNote = () => {
  const note = {
    title: uuidv4(),
    content: 'TEst note',
    date: new Date(),
    important: false,
    user: null
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

module.exports = {
  createRandomUserCustomer,
  createRandomNote,
  createRandomUser
}
