const supertest = require('supertest')
const { app } = require('../../bin/server')
const db = require('../../src/models')
const { createRandomNote } = require('../../src/utils/testingUtils')

const request = supertest(app)

describe('Notes API Test', () => {
  afterAll(async () => {
    console.log('**** Closing *****')
    // await server.close()
    // Closing the DB connection allows Jest to exit successfully.
    await db.mongoose.connection.close()
    await new Promise(resolve => setTimeout(() => resolve(), 10000)) // avoid jest open handle error
  })
  describe('Test whithout data', () => {
    test('Get ALL notes', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/notes/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data).toEqual([])
    })
    test('Get ONE by ID', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/notes/61f40101cf64737bb95caf79')
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(404)
      expect(response.body.data).toEqual(null)
    })
    test('Get ONE by Title', async () => {
      // expect.assertions(1)

      const response = await request
        .get('/api/notes/title/2222')
        .expect(404)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(404)
      expect(response.body.data).toEqual(null)
    })
    test('Create ONE randomNote', async () => {
      // expect.assertions(1)
      const mockNote = createRandomNote()
      const response = await request
        .post('/api/notes/').send(mockNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.title).toEqual(mockNote.title)
    })
    // Update Note not exists
    test('Update ONE note without id Error 400', async () => {
      // expect.assertions(1)
      const mockNote = createRandomNote()
      const response = await request
        .put('/api/notes/').send(mockNote)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(400)
    })
    // Update Note not exists
    test('Update ONE note not found id', async () => {
      // expect.assertions(1)
      const mockNote = { ...createRandomNote(), id: 'testid' }

      const response = await request
        .put('/api/notes/').send(mockNote)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(400)
    })

    // Al final de todo se limpian los usuarios creados como test.skip y como metodo de purga.
    test('Delete ALL', async () => {
      // expect.assertions(1)
      const response = await request
        .delete('/api/notes/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.deletedCount).not.toBe(null)
    })
  })

  describe('Test with data', () => {
    let mockNote1 = null
    let mockNote2 = null
    let mockNote3 = null
    let response1 = null
    let response2 = null
    let response3 = null

    beforeAll(() => {
      mockNote1 = createRandomNote()
      mockNote2 = createRandomNote()
      mockNote3 = createRandomNote()
    })
    test('Create many randomNote and GET ALL', async () => {
      // expect.assertions(1)
      response1 = await request
        .post('/api/notes/').send(mockNote1)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response2 = await request
        .post('/api/notes/').send(mockNote2)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      response3 = await request
        .post('/api/notes/').send(mockNote3)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const response = await request
        .get('/api/notes/')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data.length).toEqual(3)
    })
    test('Get ONE by ID response', async () => {
      const response = await request
        .get('/api/notes/' + response1.body.data.id)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })
    test('Get ONE by Title in Response', async () => {
      // expect.assertions(1)
      const response = await request
        .get('/api/notes/title/' + response2.body.data.title)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })

    test('Update ONE note', async () => {
      const newContent = 'NEW TEST CONTENT'
      // expect.assertions(1)
      mockNote2 = { ...mockNote2, id: response2.body.data.id, content: newContent }
      const response = await request
        .put('/api/notes/').send(mockNote2)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      expect(response.body.data.content).toEqual(newContent)
    })

    test('Delete ONE by ID response3', async () => {
      console.log('DELETE RES::', response3.body)

      const response = await request
        .delete('/api/notes/' + response3.body.data.id)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.status).toBe(200)
      expect(response.body.data).not.toEqual(null)
    })

    // Al final de todo se limpian las notas como test y como metodo de purga.
    test('Delete ALL', async () => {
      // expect.assertions(1)
      const response = await request
        .delete('/api/notes/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.status).toBe(200)
      console.log('BODY: ', response.body)
      expect(response.body.data.deletedCount).not.toBe(null)
    })
  })
})
