const {
  findOneByUsername
} = require('../services/user.service')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')

// Delete a Note with the specified id in the request
exports.doLogin = async (req, res) => {
  const { body } = req
  const { username } = body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  console.log(username)
  const response = await findOneByUsername({ username })
  res.status(response.status).send(response)
}
