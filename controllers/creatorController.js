const Creator = require('../models/Creator');
const bcrypt = require('bcrypt');

const registerCreator = async (req,res) => {
    const {username, password, email, bankNum} = req.body;
    
    if(!username || !password || !email || !bankNum){
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{
        const existingCreator = await Creator.findOne({ $or: [{username},{email}]});

        if (existingCreator) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const newCreator = new Creator({
            username,
            password,
            email,
            bankNum
        });

        await newCreator.save();

        res.status(201).json({ message: 'Creator registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginCreator = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const creator = await Creator.findOne({ username });

        if (!creator) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, creator.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', creatorId: creator._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCreator = async (req,res) => {
    try{
        const creators = await Creator.find().select('username');
        res.json(creators);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const donateCreator = async (req, res) => {
    const { amount } = req.body;
    const { username } = req.params;
  
    try {
      const creator = await Creator.findOne({ username });
      if (!creator) {
        return res.status(404).json({ message: 'Creator not found' });
      }
  
      creator.earnings += amount;
      await creator.save();
  
      res.json({ message: 'Donation successful', newEarnings: creator.earnings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {registerCreator, loginCreator, getCreator, donateCreator};