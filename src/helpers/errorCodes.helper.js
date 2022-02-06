const mongoDBErrorCodes = {
  11000: { error: 'DuplicateKey', httpStatus: 400 },
  CastError: { error: 'CastError', httpStatus: 400 }
}

const isMongoError = (errCode) => {
  // console.log('*** isMongoError err:: ', JSON.stringify(errCode))
  if (Object.prototype.hasOwnProperty.call(mongoDBErrorCodes, errCode.code)) {
    return mongoDBErrorCodes[errCode.code]
  } else if (mongoDBErrorCodes[errCode.name]) {
    return mongoDBErrorCodes[errCode.name]
  } else {
    return undefined
  }
}

module.exports = { mongoDBErrorCodes, isMongoError }
