const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const normalUserController = require('../controllers/normalUserController');

router.use(auth);
router.use(checkRole('normal_user'));

router.get('/stores', normalUserController.getStores);
router.post('/stores/:storeId/ratings', normalUserController.submitRating);
router.patch('/stores/:storeId/ratings', normalUserController.updateRating);

module.exports = router;