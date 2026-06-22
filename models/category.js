const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        libraryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Library',
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Compound Unique Index
categorySchema.index(
    {
        libraryId: 1,
        name: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model('Category', categorySchema);