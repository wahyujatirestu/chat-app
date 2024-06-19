const express = require('express');
const { login, logout, getMe } = require('../controllers/AuthController.js');
const { refreshToken } = require('../controllers/RefreshToken.js');
const { verifyUser } = require('../middleware/authUser.js');

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyUser, getMe);
router.get('/refresh', refreshToken);
router.delete('/logout', verifyUser, logout);

module.exports = router;
