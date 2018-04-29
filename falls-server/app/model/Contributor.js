module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const ContributorSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
    outsourcingId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Outsourcing' },
    wall: { type: String, required: true },
    description: { type: String }
  }, {
    timestamps: true
  })

  return mongoose.model('Contributor', ContributorSchema)
}