const express = require('express');
const router = express.Router();

const { registerCreator, loginCreator, getCreator, donateCreator } = require('../controllers/creatorController');

router.post('/register', registerCreator);
router.post('/login', loginCreator);
router.get('/getAll', getCreator);
router.post('/donate/:username', donateCreator);


module.exports = router;
