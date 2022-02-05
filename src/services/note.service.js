const { isMongoError } = require('../helpers/errorCodes.helper')
const db = require('../models')
const Note = db.notes
let { standardResponse } = require('../interface/IStandardResponse')

// Find All
const findAll = async (req) => {
  const title = req.query.title
  const condition = title ? { title: { $regex: new RegExp(title), $options: 'i' } } : {}

  await Note.find(condition)
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'Note retrieve right!',
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

// Find a single Note with an id
const findOne = async (req, next) => {
  const id = req.params.id

  await Note.findById(id)
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found Note with id ' + id,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Note retrieve OK! id=' + id,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving Note with id=' + id,
        status: 500,
        data: err
      }
    })
  return standardResponse
}

// Find a single Note with an title
const findOneByTitle = async (req) => {
  const title = req.params.title

  await Note.findOne({ title: title })
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found Note with title ' + title,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Note retrieve OK! title=' + title,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving Note with title=' + title,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Create and Save a new Note
const save = async (req) => {
  // Validate request
  if (!req.body.title) {
    standardResponse = {
      ...standardResponse,
      msg: 'Content can not be empty!',
      status: 400
    }
  } else {
    // Create a Note
    const customer = new Note({
      title: req.body.title,
      content: req.body.content ? req.body.content : '',
      date: req.body.date ? req.body.date : new Date(),
      important: req.body.important ? req.body.important : false,
      user: req.body.user ? req.body.user : ''
    })

    // Save Note in the database
    await customer
      .save(customer)
      .then(data => {
        standardResponse = {
          ...standardResponse,
          msg: 'Note save right!',
          status: 200,
          data: data
        }
      })
      .catch(err => {
        console.log(err)
        standardResponse = {
          ...standardResponse,
          msg: err.message || 'Some error occurred while creating the Note.',
          status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
          data: null
        }
      })
  }
  return standardResponse
}

// Delete All
const deleteAll = async (req) => {
  await Note.deleteMany({})
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'Note delete ALL right!',
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

// Update a Note by the id in the request
const update = async (req) => {
  if (!req.body || !req.body.id) {
    standardResponse = {
      ...standardResponse,
      msg: 'Data to update can not be empty!',
      status: 400,
      data: null
    }
  } else {
    await Note.findByIdAndUpdate(req.body.id, req.body, { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          standardResponse = {
            ...standardResponse,
            msg: `Cannot update Note with id=${req.body.id}. Maybe Note was not found!`,
            status: 400,
            data: null
          }
        } else {
          standardResponse = {
            ...standardResponse,
            msg: 'Note was updated successfully.',
            status: 200,
            data: data
          }
        }
      })
      .catch(err => {
        console.log('**************** ERROR ********************', JSON.stringify(err))
        standardResponse = {
          ...standardResponse,
          msg: err.message || 'Error updating Note with id=' + req.body.id,
          status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
          data: null
        }
      })
  }

  return standardResponse
}

// Delete a Note with the specified id in the request
const deleteOne = async (req) => {
  const id = req.params.id
  console.log('ID DELETE::', id)

  await Note.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: `Cannot delete Note with id=${id}. Maybe Note was not found!`,
          status: 400,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Note was deleted successfully.',
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error deleting Note with id=' + id,
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
  findOneByTitle,
  update,
  deleteOne

}
