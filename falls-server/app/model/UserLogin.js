module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const UserLoginSchema = new Schema({
    userId: { type: String, required: true, index: true, ref: 'User' },
    session: { type: String, required: true },
    valid: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  return mongoose.model('UserLogin', UserLoginSchema)
}
