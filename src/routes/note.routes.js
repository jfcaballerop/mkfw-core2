
module.exports = app => {
  const notes = require('../controllers/note.controller.js')
  const router = require('express').Router()

  // Retrieve all customers
  router.get('/', notes.getAll)

  /*
  // Create a new Customer
  router.post('/', customers.create)

  // Delete ALL
  router.delete('/', customers.removeAll)

  // Retrieve all active customers
  router.get('/activated', customers.getAllActivated)

  // Retrieve all ACTIVE customers order by Credit
  router.get('/credit', customers.getAllAvailableCredit)

  // Retrieve a single Customer with id
  router.get('/:id', customers.getOne)

  // Retrieve a single Customer with userName
  router.get('/user/:userName', customers.getOneByUserName)

  // Update a Customer with id
  router.put('/:id', customers.update)

  // Delete a Customer with id
  router.delete('/:id', customers.remove)
*/
  app.use('/api/notes', router)
}
