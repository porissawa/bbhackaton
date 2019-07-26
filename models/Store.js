const mongoose = require('mongoose');

const { Schema } = mongoose;

const storeSchema = new Schema({
  address: String,
  number: String,
  zipCode: String,
  neighborhood: String,
  city: String,
  UF: String,
  location: Array,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const Store = mongoose.model('store', storeSchema);
module.exports = Store;