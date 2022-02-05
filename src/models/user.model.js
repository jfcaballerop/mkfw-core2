module.exports = mongoose => {
  const schema = mongoose.Schema(
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

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Customer = mongoose.model('customer', schema)
  return Customer
}
