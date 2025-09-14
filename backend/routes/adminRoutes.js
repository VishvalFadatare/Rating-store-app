const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(auth);
router.use(checkRole('system_administrator'));

router.get('/dashboard/stats', adminController.getDashboardStats);

router.post('/users', adminController.addUser);
router.get('/users', adminController.getUsers);

router.post('/stores', adminController.addStore);
router.get('/stores', adminController.getStores);

router.get('/users/:userId', adminController.getUserDetails);

module.exports = router;