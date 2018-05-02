module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const CollectSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    photo: { type: String, required: true },
    spot: { type: String, required: true },
    material: { type: String, required: true },
    story: { type: String, required: true },
    copyright: { type: Number, required: true }
  }, {
    timestamps: true
  })

  return mongoose.model('Collect', CollectSchema)
}