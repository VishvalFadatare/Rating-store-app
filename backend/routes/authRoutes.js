const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.patch('/change-password', auth, authController.changePassword);
router.put('/change-password', auth, authController.changePassword);


module.exports = router;