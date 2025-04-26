const express = require('express');
const router = express.Router();

const { registerCreator, loginCreator } = require('../controllers/creatorController');

router.post('/register', registerCreator);
router.post('/login', loginCreator);

module.exports = router;
