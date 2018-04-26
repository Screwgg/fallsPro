module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    releaseId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Release' },
    content: { type: String, required: true },
    reward: { type: Number }
  }, {
    timestamps: true
  })

  return mongoose.model('Comment', CommentSchema)
}