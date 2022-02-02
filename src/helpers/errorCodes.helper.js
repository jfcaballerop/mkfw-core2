const mongoDBErrorCodes = {
  11000: { error: 'DuplicateKey', httpStatus: 400 }
}

const isMongoError = (errCode) => {
  console.log('*** isMongoError err:: ', JSON.stringify(errCode))
  return Object.prototype.hasOwnProperty.call(mongoDBErrorCodes, errCode.code) ? mongoDBErrorCodes[errCode.code] : undefined
}

module.exports = { mongoDBErrorCodes, isMongoError }
