const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    libraryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);