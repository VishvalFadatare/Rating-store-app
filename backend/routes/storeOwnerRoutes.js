const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const storeOwnerController = require('../controllers/storeOwnerController');

router.use(auth);
router.use(checkRole('store_owner'));

router.get('/dashboard', storeOwnerController.getDashboardData);

module.exports = router;