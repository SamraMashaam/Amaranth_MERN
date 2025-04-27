const express = require('express');
const router = express.Router();
const User = require('../models/Viewer'); // Your Mongoose User model

// GET user by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user details (you can exclude password if you want)
    res.json({
      username: user.username,
      email: user.email,
      age: user.age,
      bankAccount: user.bankAccount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT update user
router.put('/update', async (req, res) => {
    try {
      const { username, field, value } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user[field] = value; // dynamic update

      if (field === "age") {
        const ageNumber = parseInt(value, 10); // just in case
        if (!isNaN(ageNumber)) {
          user.isKid = ageNumber <= 13 ? true : false ;
        }
      }

      await user.save();
  
      res.json({ message: 'User updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });  

module.exports = router;
