module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const MagazineSchema = new Schema({
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true }
  }, {
    timestamps: true
  })

  return mongoose.model('magazine', MagazineSchema)
}