const express = require('express');
const router = express.Router();

const { registerViewer, loginViewer } = require('../controllers/viewerController');

router.post('/register', registerViewer);
router.post('/login', loginViewer);

module.exports = router;
