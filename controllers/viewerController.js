const Viewer = require('../models/Viewer');
const bcrypt = require('bcrypt');

const registerViewer = async (req, res) => {
    const { username, password, email, bankNum, age } = req.body;

    if (!username || !password || !email || !bankNum || !age) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if username or email already exists
        const existingViewer = await Viewer.findOne({ $or: [{ username }, { email }] });
        if (existingViewer) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const isKid = age <= 13 ? true : false;

        const newViewer = new Viewer({
            username,
            password,
            email,
            bankNum,
            age,
            isKid
        });

        await newViewer.save();

        res.status(201).json({ message: 'Viewer registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginViewer = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const viewer = await Viewer.findOne({ username });

        if (!viewer) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, viewer.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', viewerId: viewer._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerViewer, loginViewer };
