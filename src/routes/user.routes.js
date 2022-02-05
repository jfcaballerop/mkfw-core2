
module.exports = app => {
  const users = require('../controllers/user.controller.js')
  const router = require('express').Router()

  // Create a new Note
  router.post('/', users.create)

  /*
  // Retrieve all notes
  router.get('/', notes.getAll)

  // Retrieve a single Note with id
  router.get('/:id', notes.getOne)

  // Retrieve a single Note with title
  router.get('/title/:title', notes.getOneByTitle)

  // Delete ALL
  router.delete('/', notes.removeAll)

  // Update a Note
  router.put('/', notes.update)

  // Delete a Note with id
  router.delete('/:id', notes.remove)

  */
  app.use('/api/users', router)
}
