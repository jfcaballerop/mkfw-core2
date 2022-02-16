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

  //   NO DATA  //
  describe('User with NO DATA', () => {
    beforeEach(async () => {
      await User.deleteMany({})
    })
    test('get ALL users is empty', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data).toHaveLength(0)
    })
    test('get One user by username - Not Found', async () => {
      const usernameTest = 'testuser'
      const response = await api
        .get(`/api/users/${usernameTest}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data).toBe(null)
    })
    test('get One user by ID - Not Found', async () => {
      const IDTest = '123456789'
      const response = await api
        .get(`/api/users/${IDTest}`)
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data).toBe(null)
    })
  })

  // WITH DATA
  describe('User with DATA', () => {
    const usermock = {
      username: 'testuser'
    }
    beforeEach(async () => {
      await User.deleteMany({ username: usermock.username })

      const passwordHash = await bcrypt.hash('pswd', 10)
      const user = new User({ username: 'testuser', passwordHash })

      await user.save()
    })

    afterAll(async () => {
      await User.deleteMany({})
    })

    test('works as expected creating a fresh username', async () => {
      const usersAtStart = await getUsers({ username: 'testuser' })

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

      const usersAtEnd = await getUsers({
        $or: [
          { username: 'testuser' },
          { username: 'jf' }
        ]
      })

      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('send error if username exists', async () => {
      const usersAtStart = await getUsers({ username: 'testuser' })
      console.log('¡usersAtStart', usersAtStart)
      const passwordHash = await bcrypt.hash('pswd', 10)
      const user = { username: 'testuser', passwordHash }

      const result = await api
        .post('/api/users/')
        .send(user)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      // console.log('****', result.bwody)
      expect(result.body.msg).toContain('duplicate key error')

      const usersAtEnd = await getUsers({ username: 'testuser' })
      console.log('usersAtEnd', usersAtEnd)
      expect(usersAtEnd).toStrictEqual(usersAtStart)
    })

    test('get ALL users', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data).not.toHaveLength(0)
    })

    test('get One user by username and retrieve it', async () => {
      const usernameTest = 'testuser'
      const response = await api
        .get(`/api/users/${usernameTest}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data.username).toBe(usernameTest)
    })
    test('get One user by ID', async () => {
      const user = await User.findOne({ username: usermock.username })
      const response = await api
        .get(`/api/users/id/${user.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data.username).toBe(usermock.username)
    })

    test('remove All users', async () => {
      const response = await api
        .delete('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data).toHaveProperty('deletedCount')
    })

    test('update User', async () => {
      const user = await User.findOne({ username: usermock.username }).exec()
      user.username = 'update'
      user.id = user._id
      console.log(user)
      const response = await api
        .put('/api/users')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.data).toHaveProperty(null)
    })
  })
})
