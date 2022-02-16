
module.exports = app => {
  const login = require('../controllers/login.controller.js')
  const router = require('express').Router()

  // signin
  router.post('/', login.signin)

  app.use('/api/login', router)
}
