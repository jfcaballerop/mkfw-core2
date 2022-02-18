const userExtractor = require('../middleware/userExtractor.js')

module.exports = app => {
  const notes = require('../controllers/note.controller.js')
  const router = require('express').Router()

  // Retrieve all notes
  router.get('/', notes.getAll)

  // Retrieve a single Note with id
  router.get('/:id', notes.getOne)

  // Retrieve a single Note with title
  router.get('/title/:title', notes.getOneByTitle)

  // Create a new Note
  router.post('/', userExtractor, notes.create)

  // Delete ALL
  router.delete('/', notes.removeAll)

  // Update a Note
  router.put('/', notes.update)

  // Delete a Note with id
  router.delete('/:id', notes.remove)

  app.use('/api/notes', router)
}
