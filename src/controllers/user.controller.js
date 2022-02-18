const {
  findAll,
  findOne,
  findOneByUsername,
  save,
  deleteAll,
  deleteOne,
  update
} = require('../services/user.service')

// Retrieve all Notes from the database.
exports.getAll = async (req, res) => {
  const response = await findAll(req)
  res.status(response.status).send(response)
}

// Find a single Note with an id
exports.getOne = async (req, res, next) => {
  const response = await findOne(req, next)
  // check if error
  if (response.status !== 500) {
    res.status(response.status).send(response)
  } else {
    next(response.data)
  }
}
// Find a single Note with an userName
exports.getOneByUserName = async (req, res) => {
  const response = await findOneByUsername(req)
  res.status(response.status).send(response)
}
// Find a single Note with an ID
exports.getOneById = async (req, res) => {
  const response = await findOne(req)
  res.status(response.status).send(response)
}

// Create and Save a new Note
exports.create = async (req, res) => {
  const response = await save(req)
  res.status(response.status).send(response)
}

// Delete all Notes from the database.
exports.removeAll = async (req, res) => {
  const response = await deleteAll(req)
  res.status(response.status).send(response)
}

// Update a Note by the id in the request
exports.update = async (req, res) => {
  const response = await update(req)
  res.status(response.status).send(response)
}

// Delete a Note with the specified id in the request
exports.remove = async (req, res) => {
  const response = await deleteOne(req)
  res.status(response.status).send(response)
}
