module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const QaSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    title: { type: String, required: true },
    des: { type: String, required: true },
    invite: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    worth: { type: Number, required: true },
    onlooker: { type: Number, required: true },
    answer: { type: String }
  }, {
    timestamps: true
  })

  return mongoose.model('Qa', QaSchema)
}