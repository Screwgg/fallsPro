module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const HotlistSchema = new Schema({
    releaseId: { type: Schema.Types.ObjectId, required: true, ref: 'Release' },
    commentCount: { type: Number, default: 0 },
    rewardSum: { type: Number, default: 0 }
  }, {
    timestamps: true
  })

  return mongoose.model('hotlist', HotlistSchema)
}