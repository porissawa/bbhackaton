const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  name: { type: String },
  password: String,
  coupon: Number,
  confirmationCode: String,
  hasConfirmed: Boolean,
  cpf: String,
  isAdmin: Boolean,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
