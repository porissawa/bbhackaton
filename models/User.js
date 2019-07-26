const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  name: { type: String },
  coupon: Number,
  confirmationCode: String,
  hasConfirmed: Boolean,
  cpf: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
