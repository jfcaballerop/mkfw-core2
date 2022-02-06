const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    name: String,
    passwordHash: String,
    notes: [{
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }]
  },
  { timestamps: true }
)

userSchema.method('toJSON', function () {
  const { __v, _id, passwordHash, ...object } = this.toObject()
  object.id = _id
  return object
})

const User = model('User', userSchema)

module.exports = User
