module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const CopyrightSchema = new Schema({
    collectId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Collect' },
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' }
  }, {
    timestamps: true
  })

  return mongoose.model('Copyright', CopyrightSchema)
}