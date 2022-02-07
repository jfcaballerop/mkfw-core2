const { check } = require('express-validator')

exports.loginUserValidate = [
  check('username').exists().withMessage('Username can not be empty!').bail().isLength({ min: 4 }).withMessage('min length is 5 char'),
  check('password').exists().withMessage('Password can not be empty!').bail().isLength({ min: 5 }).withMessage('password format is incorrect')
]
