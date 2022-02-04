module.exports = app => {
  const customers = require('../controllers/customer.controller.js')

  const router = require('express').Router()

  // Create a new Customer
  router.post('/', customers.create)

  // Retrieve all customers
  router.get('/', customers.getAll)

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

  app.use('/api/customers', router)
}
