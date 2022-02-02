const CustomerService = require('../services/customer.service')
const { customerToCustomerDTO } = require('../mappers/customerToCustomerDTO')

// Create and Save a new Customer
exports.create = async (req, res) => {
  const response = await CustomerService.save(req)
  res.status(response.status).send(response)
}

// Retrieve all Customers from the database.
exports.getAll = async (req, res) => {
  const response = await CustomerService.findAll(req)
  res.status(response.status).send(response)
}

// Delete all Customers from the database.
exports.removeAll = async (req, res) => {
  const response = await CustomerService.deleteAll(req)
  res.status(response.status).send(response)
}

// Find a single Customer with an id
exports.getOne = async (req, res, next) => {
  const response = await CustomerService.findOne(req, next)
  // check if error
  if (response.status !== 500) {
    res.status(response.status).send(response)
  } else {
    next(response.data)
  }
}

// Find a single Customer with an userName
exports.getOneByUserName = async (req, res) => {
  let response = await CustomerService.findOneByUserName(req)
  response = {
    ...response,
    data: customerToCustomerDTO(response.data)
  }
  res.status(response.status).send(response)
}

// Update a Customer by the id in the request
exports.update = async (req, res) => {
  const response = await CustomerService.update(req)
  res.status(response.status).send(response)
}

// Delete a Customer with the specified id in the request
exports.remove = async (req, res) => {
  const response = await CustomerService.deleteOne(req)
  res.status(response.status).send(response)
}

// Find all activate Customers
exports.getAllActivated = async (req, res) => {
  const response = await CustomerService.findAllActivated()
  res.status(response.status).send(response)
}

// Retrieve all ACTIVE customers order by Credit
exports.getAllAvailableCredit = async (req, res) => {
  console.log('Controller')
  const response = await CustomerService.findAllAvailableCreditOrderByCredit()
  res.status(response.status).send(response)
}
