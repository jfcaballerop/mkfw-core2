const supertest = require('supertest')
const { app, server } = require('../../bin/server')
const db = require('../../src/models')
const { createRandomUser } = require('../../src/utils/testingUtils')

const request = supertest(app)

describe('Customer API Test', () => {
  afterAll(async () => {
    console.log('**** Closing *****')
    await server.close()
    // Closing the DB connection allows Jest to exit successfully.
    await db.mongoose.connection.close()
    await new Promise(resolve => setTimeout(() => resolve(), 10000)) // avoid jest open handle error
  })

  test('--- Ping test ---', async () => {
    const response = await request.get('/')

    expect(response.statusCode).toBe(200)
  })

  describe('Test whithout data', () => {
    test('Get ALL customers', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/customers/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data).toEqual([])
    })
    test('Get ONE by ID', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/customers/61f40101cf64737bb95caf79')
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(404)
      expect(response.body.data).toEqual(null)
    })
    test('Get ONE by Name', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/customers/user/2222')
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(404)
      expect(response.body.data).toEqual(null)
    })
    test('Create ONE randomuser', async () => {
      // expect.assertions(1)
      const mockUser = createRandomUser()
      const response = await request
        .post('/api/customers/').send(mockUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.userName).toEqual(mockUser.userName)
    })

    // Al final de todo se limpian los usuarios creados como test y como metodo de purga.
    test('Delete ALL', async () => {
      // expect.assertions(1)
      const response = await request
        .delete('/api/customers/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.deletedCount).not.toBe(null)
    })
  })

  describe('Test with data', () => {
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
    test('Create many randomuser and GET ALL', async () => {
      // expect.assertions(1)
      response1 = await request
        .post('/api/customers/').send(mockUser1)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response2 = await request
        .post('/api/customers/').send(mockUser2)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response3 = await request
        .post('/api/customers/').send(mockUser3)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await request
        .get('/api/customers/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.length).toEqual(3)
    })
    test('Get ONE by ID response', async () => {
      const response = await request
        .get('/api/customers/' + response1.body.data.id)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })
    test('Get ONE by Name in Response', async () => {
      // expect.assertions(1)
      const response = await request
        .get('/api/customers/user/' + response2.body.data.userName)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })
    test('Delete ONE by ID response3', async () => {
      console.log('DELETE RES::', response3.body)

      const response = await request
        .delete('/api/customers/' + response3.body.data.id)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })

    // Al final de todo se limpian los usuarios creados como test y como metodo de purga.
    test('Delete ALL', async () => {
      // expect.assertions(1)
      const response = await request
        .delete('/api/customers/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      console.log('BODY: ', response.body)
      expect(response.body.data.deletedCount).not.toBe(null)
    })
  })
})
