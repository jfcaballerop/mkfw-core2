
module.exports = app => {
  const users = require('../controllers/user.controller.js')
  const router = require('express').Router()

  // Create a new User
  router.post('/', users.create)

  // Retrieve all users
  router.get('/', users.getAll)

  // Retrieve a single User with username
  router.get('/:username', users.getOneByUserName)

  // Retrieve a single User with id
  router.get('/id/:id', users.getOneById)

  // Delete ALL
  router.delete('/', users.removeAll)

  // Update a User
  router.put('/', users.update)

  /*
  // Delete a User with id
  router.delete('/:id', users.remove)

  */
  app.use('/api/users', router)
}
