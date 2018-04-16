module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const bcrypt = require('bcrypt')

  const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    job: { type: String },
  }, {
    timestamps: true,
  })


  UserSchema.pre('save', function(next) {
    if (this.isModified('password')) {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(this.password, salt) 
      this.password = hash 
    }
    return next()
  })

  UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password) 
  }

  return mongoose.model('User', UserSchema)
}
