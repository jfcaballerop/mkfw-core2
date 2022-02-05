const { isMongoError } = require('../helpers/errorCodes.helper')
const db = require('../models')
const Customer = db.customers
let { standardResponse } = require('../interface/IStandardResponse')

// Create and Save a new Customer
const save = async (req) => {
  // Validate request
  if (!req.body.userName) {
    standardResponse = {
      ...standardResponse,
      msg: 'Content can not be empty!',
      status: 400
    }
  } else {
    // Create a Customer
    const customer = new Customer({
      userName: req.body.userName,
      name: req.body.name ? req.body.name : {},
      description: req.body.description ? req.body.description : '',
      active: req.body.active ? req.body.active : true,
      city: req.body.city ? req.body.city : '',
      country: req.body.country ? req.body.country : '',
      phone: req.body.phone ? req.body.phone : [],
      availableCredit: req.body.availableCredit ? req.body.availableCredit : 0
    })

    // Save Customer in the database
    await customer
      .save(customer)
      .then(data => {
        standardResponse = {
          ...standardResponse,
          msg: 'Customer save right!',
          status: 200,
          data: data
        }
      })
      .catch(err => {
        console.log(err)
        standardResponse = {
          ...standardResponse,
          msg: err.message || 'Some error occurred while creating the Customer.',
          status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
          data: null
        }
      })
  }
  return standardResponse
}

// Find All
const findAll = async (req) => {
  const userName = req.query.userName
  const condition = userName ? { userName: { $regex: new RegExp(userName), $options: 'i' } } : {}

  await Customer.find(condition)
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'Customer retrieve right!',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Some error occurred while retrieving customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Delete All
const deleteAll = async (req) => {
  await Customer.deleteMany({})
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'Customer delete ALL right!',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Some error occurred while removing all customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })

  return standardResponse
}

// Find a single Customer with an id
const findOne = async (req, next) => {
  const id = req.params.id

  await Customer.findById(id)
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found Customer with id ' + id,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Customer retrieve OK! id=' + id,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving Customer with id=' + id,
        status: 500,
        data: err
      }
    })
  return standardResponse
}
// Find a single Customer with an userName
const findOneByUserName = async (req) => {
  const userName = req.params.userName

  await Customer.findOne({ userName: userName })
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'Not found Customer with userName ' + userName,
          status: 404,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Customer retrieve OK! userName=' + userName,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving Customer with userName=' + userName,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Update a Customer by the id in the request
const update = async (req) => {
  if (!req.body) {
    standardResponse = {
      ...standardResponse,
      msg: 'Data to update can not be empty!',
      status: 400,
      data: null
    }
  }

  const id = req.params.id

  // TODO: Add new:true si queremos que nos devuelva el objeto nuevo
  await Customer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: `Cannot update Customer with id=${id}. Maybe Customer was not found!`,
          status: 400,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Customer was updated successfully.',
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error updating Customer with id=' + id,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Delete a Customer with the specified id in the request
const deleteOne = async (req) => {
  const id = req.params.id
  console.log('ID DELETE::', id)

  await Customer.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
          status: 400,
          data: null
        }
      } else {
        standardResponse = {
          ...standardResponse,
          msg: 'Customer was deleted successfully.',
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error deleting Customer with id=' + id,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Find all published Customers
const findAllActivated = async () => {
  await Customer.find({ active: true })
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'Customer was retrieve successfully.',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Some error occurred while retrieving customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

// Find All Customer ACTIVATED OrderByCredit
const findAllAvailableCreditOrderByCredit = async () => {
  await Customer.find({ active: true }).sort('-availableCredit')
    .then(data => {
      standardResponse = {
        ...standardResponse,
        msg: 'Customer order by available Credit was retrieve successfully.',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Some error occurred while retrieving customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return standardResponse
}

module.exports = {
  save,
  findAll,
  deleteAll,
  findOne,
  findOneByUserName,
  update,
  deleteOne,
  findAllActivated,
  findAllAvailableCreditOrderByCredit
}
