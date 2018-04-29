module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema

  const FilterSchema = new Schema({
    outsourcingId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Outsourcing' },
    contributorId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Contributor' }
  }, {
    timestamps: true
  })

  return mongoose.model('Filter', FilterSchema)
}