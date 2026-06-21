const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  libraryCode: {
    type: String,
    unique: true
  },
  address: String,
  mobile: String,
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Library', librarySchema);