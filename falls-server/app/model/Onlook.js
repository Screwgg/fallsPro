module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const OnlookSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    qaId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Qa' },
    payAnswer: { type: Boolean, default: false }
  }, {
    timestamps: true
  })

  return mongoose.model('Onlook', OnlookSchema)
}