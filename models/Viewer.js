const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const viewerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bankNum: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    isKid: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

// Hash password before saving
viewerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const Viewer = mongoose.model('Viewer', viewerSchema);

module.exports = Viewer;
