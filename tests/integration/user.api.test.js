const supertest = require('supertest')
const { app } = require('../../bin/server')
const db = require('../../src/models')
const { createRandomUser } = require('../../src/utils/testingUtils')

const request = supertest(app)

describe('Users API Test', () => {
  afterAll(async () => {
    console.log('**** Closing *****')
    // await server.close()
    // Closing the DB connection allows Jest to exit successfully.
    await db.mongoose.connection.close()
    await new Promise(resolve => setTimeout(() => resolve(), 10000)) // avoid jest open handle error
  })
  describe('Test whithout data', () => {
    test('Create ONE randomUser', async () => {
      // expect.assertions(1)
      const mockUser = createRandomUser()
      const response = await request
        .post('/api/users/').send(mockUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.title).toEqual(mockUser.title)
    })
    test.skip('Get ALL users', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/users/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data).toEqual([])
    })
    test.skip('Get ONE by ID', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/users/61f40101cf64737bb95caf79')
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(404)
      expect(response.body.data).toEqual(null)
    })
    test.skip('Get ONE by Title', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/users/title/2222')
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(404)
      expect(response.body.data).toEqual(null)
    })

    // Update User not exists
    test.skip('Update ONE user without id Error 400', async () => {
      // expect.assertions(1)
      const mockUser = createRandomUser()
      const response = await request
        .put('/api/users/').send(mockUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(400)
    })
    // Update User not exists
    test.skip('Update ONE user not found id', async () => {
      // expect.assertions(1)
      const mockUser = { ...createRandomUser(), id: 'testid' }

      const response = await request
        .put('/api/users/').send(mockUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(400)
    })

    // Al final de todo se limpian los usuarios creados como test.skip y como metodo de purga.
    test.skip('Delete ALL', async () => {
      // expect.assertions(1)
      const response = await request
        .delete('/api/users/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.deletedCount).not.toBe(null)
    })
  })

  describe.skip('Test with data', () => {
    let mockUser1 = null
    let mockUser2 = null
    let mockUser3 = null
    let response1 = null
    let response2 = null
    let response3 = null

    beforeAll(() => {
      mockUser1 = createRandomUser()
      mockUser2 = createRandomUser()
      mockUser3 = createRandomUser()
    })
    test('Create many randomUser and GET ALL', async () => {
      // expect.assertions(1)
      response1 = await request
        .post('/api/users/').send(mockUser1)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response2 = await request
        .post('/api/users/').send(mockUser2)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response3 = await request
        .post('/api/users/').send(mockUser3)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await request
        .get('/api/users/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.length).toEqual(3)
    })
    test('Get ONE by ID response', async () => {
      const response = await request
        .get('/api/users/' + response1.body.data.id)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })
    test('Get ONE by Title in Response', async () => {
      // expect.assertions(1)
      const response = await request
        .get('/api/users/title/' + response2.body.data.title)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })

    test('Update ONE user', async () => {
      const newContent = 'NEW TEST CONTENT'
      // expect.assertions(1)
      mockUser2 = { ...mockUser2, id: response2.body.data.id, content: newContent }
      const response = await request
        .put('/api/users/').send(mockUser2)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data.content).toEqual(newContent)
    })

    test('Delete ONE by ID response3', async () => {
      console.log('DELETE RES::', response3.body)

      const response = await request
        .delete('/api/users/' + response3.body.data.id)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })

    // Al final de todo se limpian las notas como test y como metodo de purga.
    test('Delete ALL', async () => {
      // expect.assertions(1)
      const response = await request
        .delete('/api/users/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      console.log('BODY: ', response.body)
      expect(response.body.data.deletedCount).not.toBe(null)
    })
  })
})
