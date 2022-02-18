const bcrypt = require('bcrypt')
const { isMongoError } = require('../helpers/errorCodes.helper')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.users
let { standardResponse } = require('../interface/IStandardResponse')

// Find a single User with an username
const doLogin = async (user) => {
  const { username, password } = user
  await User.findOne({ username: username })
    .then(async (data) => {
      if (!data) {
        standardResponse = {
          ...standardResponse,
          msg: 'User or password are incorrect',
          status: 404,
          data: null
        }
      } else {
        const passwordCorrect = await bcrypt.compare(password, data.passwordHash)
        const respLogin = {
          id: data.id,
          username: data.username
        }
        // TODO: refactor para sacarlo a una function
        const token = jwt.sign(respLogin, process.env.SECRET,
          {
            expiresIn: 60 * 60 * 24 * 7 // TODO: sacar el Expire a .env
          })
        if (passwordCorrect) {
          standardResponse = {
            ...standardResponse,
            msg: 'Login correct',
            status: 200,
            data: token
          }
        } else {
          standardResponse = {
            ...standardResponse,
            msg: 'Login fail',
            status: 401,
            data: null
          }
        }
      }
    })
    .catch(err => {
      standardResponse = {
        ...standardResponse,
        msg: err.message || 'Error retrieving User or Password',
        status: isMongoError(err) ? isMongoError(err).httpStatus : 500,
        data: null
      }
    })

  return standardResponse
}
module.exports = {
  doLogin

}
