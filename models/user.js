const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Library'
  },
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'member'],
    default: 'admin'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);