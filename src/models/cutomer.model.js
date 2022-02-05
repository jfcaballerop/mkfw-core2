const { Schema, model } = require('mongoose')

const customerSchema = new Schema(
  {
    userName: { type: String, index: true, unique: true, required: true },
    name: {
      firstName: String,
      lastName: String
    },
    description: String,
    active: { type: Boolean, default: true },
    city: String,
    country: String,
    phone: [String],
    entryDate: { type: Date, default: Date.now },
    availableCredit: { type: Number, default: 0 }
  },
  { timestamps: true }
)

customerSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject()
  object.id = _id
  return object
})

const Customer = model('customer', customerSchema)

module.exports = Customer
