const { loginUserValidate } = require('../helpers/validators/userValidator.js')

module.exports = app => {
  const login = require('../controllers/login.controller.js')
  const router = require('express').Router()

  // Do Login
  router.post('/', loginUserValidate, login.doLogin)

  app.use('/api/login', router)
}
