const mongoose = require('mongoose');

const { Schema } = mongoose;

const siteSchema = new Schema({
  accesses: Number,
  signups: Number,
  confirmedSignups: Number,
  leads: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Site = mongoose.model('Site', siteSchema);
module.exports = Site;
