module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const OutsourcingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    theme: { type: String, required: true },
    demand: { type: String, required: true },
    bonus: { type: Number, required: true },
    deadline: { type: String, required: true }
  }, {
    timestamps: true
  })

  return mongoose.model('Outsourcing', OutsourcingSchema)
}