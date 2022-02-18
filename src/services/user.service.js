const bcrypt = require('bcrypt')
const { isMongoError } = require('../helpers/errorCodes.helper')
const db = require('../models')
const User = db.users
let { standardResponse } = require('../interface/IStandardResponse')

// Find All
const findAll = async (req) => {
  const username = req.query.username
  const condition = username ? { username: { $regex: new RegExp(username), $options: 'i' } } : {}

  await User.find(condition).populate('notes', {
    content: 1,
    username: 1,
    date: 1
  })
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'User retrieve right!',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Some error occurred while retrieving notes.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Find a single User with an id
const findOne = async (req, next) => {
  const id = req.params.id

  await User.findById(id)
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found User with id ' + id,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'User retrieve OK! id=' + id,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving User with id=' + id,
        status: 500,
        data: err
      }
    })
  return standardResponse
}

// Find a single User with an username
const findOneByUsernamePassword = async (user) => {
  const { username, password } = user
  await User.findOne({ username: username })
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found User with username ' + username,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'User retrieve OK! username=' + username,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving User with username=' + username,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })

  // TODO: hacer un bcryptCompare
  const passwordHash = await bcrypt.compare(password, standardResponse.data.passwordHash)
  console.log('UserName y PasswordHash', username, passwordHash)

  return standardResponse
}

const findOneByUsername = async (req) => {
  const username = req.params.username

  await User.findOne({ username: username })
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found User with username ' + username,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'User retrieve OK! username=' + username,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving User with username=' + username,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Create and Save a new User
const save = async (req) => {
  const { body } = req
  const { username, name, password } = body
  // Validate request
  if (!username) {
    standardResponse = {
      ...standardResponse,
      msg: 'Content can not be empty!',
      status: 400
    }
  } else {
    // Create a User
    const user = new User({
      username: username,
      name: name || '',
      passwordHash: password ? await bcrypt.hash(password, 10) : ''
    })

    // Save User in the database
    await user
      .save(user)
      .then(data => {
        standardResponse = {
          ...standardResponse,
          msg: 'User save right!',
          status: 201,
          data: data
        }
      })
      .catch(err => {
        console.log(err)
        standardResponse = {
          ...standardResponse,
          msg: err.message || 'Some error occurred while creating the User.',
          status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
          data: null
        }
      })
  }
  return standardResponse
}

// Delete All
const deleteAll = async (req) => {
  await User.deleteMany({})
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'User delete ALL right!',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Some error occurred while removing all notes.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })

  return standardResponse
}

// Update a User by the id in the request
const update = async (req) => {
  if (!req.body || !req.body.id) {
    standardResponse = {
      ...standardResponse,
      msg: 'Data to update can not be empty!',
      status: 400,
      data: null
    }
  } else {
    await User.findByIdAndUpdate(req.body.id, req.body, { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          standardResponse = {
            ...standardResponse,
            msg: `Cannot update User with id=${req.body.id}. Maybe User was not found!`,
            status: 400,
            data: null
          }
        } else {
          standardResponse = {
            ...standardResponse,
            msg: 'User was updated successfully.',
            status: 200,
            data: data
          }
        }
      })
      .catch(err => {
        console.log('**************** ERROR ********************', JSON.stringify(err))
        standardResponse = {
          ...standardResponse,
          msg: err.message || 'Error updating User with id=' + req.body.id,
          status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
          data: null
        }
      })
  }

  return standardResponse
}

// Delete a User with the specified id in the request
const deleteOne = async (req) => {
  const id = req.params.id
  console.log('ID DELETE::', id)

  await User.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: `Cannot delete User with id=${id}. Maybe User was not found!`,
          status: 400,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'User was deleted successfully.',
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error deleting User with id=' + id,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

module.exports = {
  findAll,
  save,
  deleteAll,
  findOne,
  findOneByUsernamePassword,
  findOneByUsername,
  update,
  deleteOne

}
