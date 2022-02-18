module.exports = app => {
  const { loginUserValidate } = require('../helpers/validators/userValidator.js')
  const login = require('../controllers/login.controller.js')
  const router = require('express').Router()

  // Do Login
  router.post('/', loginUserValidate, login.doLogin)
  // signin
  router.post('/', login.signin)

  app.use('/api/login', router)
}
