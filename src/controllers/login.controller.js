const { doLogin } = require('../services/login.service')
const { findOneByUsername } = require('../services/user.service')
const { validationResult } = require('express-validator/check')

// Delete a Note with the specified id in the request
exports.doLogin = async (req, res) => {
  const { body } = req
  const { username, password } = body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  console.log(username, password)
  const response = await doLogin({ username, password })
  res.status(response.status).send(response)
}

// Do signin
exports.signin = async (req, res) => {
  const response = await findOneByUsername(req)
  res.status(response.status).send(response)
}
