
const { concatUpper } = require('../utils/string.utils')
const { customerDTO } = require('../interface/dto/ICustomer.dto')

const customerToCustomerDTO = (orig) => {
  if (orig) {
    const origVal = JSON.parse(JSON.stringify(orig))
    // console.log(orig)
    // Add transform for same key
    for (const key in customerDTO) {
      if (Object.prototype.hasOwnProperty.call(orig, key)) {
        // Review custom mapper
        if (key === 'name') {
          customerDTO[key] = concatUpper(origVal[key])
        } else {
          customerDTO[key] = origVal[key]
        }
      } else {
        // console.log('*** key not fount', key)
      }
    }

    return customerDTO
  } else {
    return null
  }
}

module.exports = {
  customerToCustomerDTO
}
