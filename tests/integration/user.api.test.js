// const supertest = require('supertest')
const User = require('../../src/models/user.model')
const { api, closingTestConnections, getUsers } = require('../../src/utils/testingUtils')
const bcrypt = require('bcrypt')

describe('User API Test', () => {
  afterAll(async () => {
    closingTestConnections()
    await new Promise(resolve => setTimeout(() => resolve(), 5000)) // avoid jest open handle error
  })

  test('--- Ping test ---', async () => {
    const response = await api.get('/')

    expect(response.statusCode).toBe(200)
  })

  // Init data
  describe('User Test DATA', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('pswd', 10)
      const user = new User({ username: 'testuser', passwordHash })

      await user.save()
    })

    test('works as expected creating a fresh username', async () => {
      const usersAtStart = await getUsers()

      const newUser = {
        username: 'jf',
        name: 'Jose',
        password: 'testing'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await getUsers()

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })
})
