const {
  findOneByUsername
} = require('../services/login.service')

// Do signin
exports.signin = async (req, res) => {
  const response = await findOneByUsername(req)
  res.status(response.status).send(response)
}
