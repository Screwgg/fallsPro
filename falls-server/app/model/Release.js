module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ReleaseSchema = new Schema({
    userId: { type: String, required: true, index: true, ref: 'User' },
    title: { type: String, required: true },
    type: { type: String, required: true },
    avatar: { type: String, required: true },
    content: { type: String, required: true }
  }, {
    timestamps: true
  })

  return mongoose.model('Release', ReleaseSchema)
}
