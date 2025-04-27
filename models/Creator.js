const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const creatorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bankNum: { type: String, required: true },
    earnings: { type: Number, default: 0 }
});

// Hash password before saving
creatorSchema.pre('save', async function (next) {
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

const Creator = mongoose.model('Creator', creatorSchema);

module.exports = Creator;
