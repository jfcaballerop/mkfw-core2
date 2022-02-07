const { check } = require('express-validator/check')

exports.loginUserValidate = [check('username').isLength({ min: 4 })]
