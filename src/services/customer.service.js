const { isMongoError } = require('../helpers/errorCodes.helper')
const db = require('../models')
const Customer = db.customers
let { customerResponse } = require('../interface/ICustomerResponse')

// Create and Save a new Customer
const save = async (req) => {
  // Validate request
  if (!req.body.userName) {
    customerResponse = {
      ...customerResponse,
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
        customerResponse = {
          ...customerResponse,
          msg: 'Customer save right!',
          status: 200,
          data: data
        }
      })
      .catch(err => {
        console.log(err)
        customerResponse = {
          ...customerResponse,
          msg: err.message || 'Some error occurred while creating the Customer.',
          status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
          data: null
        }
      })
  }
  return customerResponse
}

// Find All
const findAll = async (req) => {
  const userName = req.query.userName
  const condition = userName ? { userName: { $regex: new RegExp(userName), $options: 'i' } } : {}

  await Customer.find(condition)
    .then(data => {
      customerResponse = {
        ...customerResponse,
        msg: 'Customer retrieve right!',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Some error occurred while retrieving customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return customerResponse
}

// Delete All
const deleteAll = async (req) => {
  await Customer.deleteMany({})
    .then(data => {
      customerResponse = {
        ...customerResponse,
        msg: 'Customer delete ALL right!',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Some error occurred while removing all customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })

  return customerResponse
}

// Find a single Customer with an id
const findOne = async (req, next) => {
  const id = req.params.id

  await Customer.findById(id)
    .then(data => {
      if (!data) {
        customerResponse = {
          ...customerResponse,
          msg: 'Not found Customer with id ' + id,
          status: 404,
          data: null
        }
      } else {
        customerResponse = {
          ...customerResponse,
          msg: 'Customer retrieve OK! id=' + id,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Error retrieving Customer with id=' + id,
        status: 500,
        data: err
      }
    })
  return customerResponse
}
// Find a single Customer with an userName
const findOneByUserName = async (req) => {
  const userName = req.params.userName

  await Customer.findOne({ userName: userName })
    .then(data => {
      if (!data) {
        customerResponse = {
          ...customerResponse,
          msg: 'Not found Customer with userName ' + userName,
          status: 404,
          data: null
        }
      } else {
        customerResponse = {
          ...customerResponse,
          msg: 'Customer retrieve OK! userName=' + userName,
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Error retrieving Customer with userName=' + userName,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return customerResponse
}

// Update a Customer by the id in the request
const update = async (req) => {
  if (!req.body) {
    customerResponse = {
      ...customerResponse,
      msg: 'Data to update can not be empty!',
      status: 400,
      data: null
    }
  }

  const id = req.params.id

  await Customer.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        customerResponse = {
          ...customerResponse,
          msg: `Cannot update Customer with id=${id}. Maybe Customer was not found!`,
          status: 400,
          data: null
        }
      } else {
        customerResponse = {
          ...customerResponse,
          msg: 'Customer was updated successfully.',
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Error updating Customer with id=' + id,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return customerResponse
}

// Delete a Customer with the specified id in the request
const deleteOne = async (req) => {
  const id = req.params.id
  console.log('ID DELETE::', id)

  await Customer.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        customerResponse = {
          ...customerResponse,
          msg: `Cannot delete Customer with id=${id}. Maybe Customer was not found!`,
          status: 400,
          data: null
        }
      } else {
        customerResponse = {
          ...customerResponse,
          msg: 'Customer was deleted successfully.',
          status: 200,
          data: data
        }
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Error deleting Customer with id=' + id,
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return customerResponse
}

// Find all published Customers
const findAllActivated = async () => {
  await Customer.find({ active: true })
    .then(data => {
      customerResponse = {
        ...customerResponse,
        msg: 'Customer was retrieve successfully.',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Some error occurred while retrieving customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return customerResponse
}

// Find All Customer ACTIVATED OrderByCredit
const findAllAvailableCreditOrderByCredit = async () => {
  await Customer.find({ active: true }).sort('-availableCredit')
    .then(data => {
      customerResponse = {
        ...customerResponse,
        msg: 'Customer order by available Credit was retrieve successfully.',
        status: 200,
        data: data
      }
    })
    .catch(err => {
      customerResponse = {
        ...customerResponse,
        msg: err.message || 'Some error occurred while retrieving customers.',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })
  return customerResponse
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
