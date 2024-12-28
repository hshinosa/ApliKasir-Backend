const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register-pengguna', authController.registerPengguna);
router.post('/register-admin', authController.registerAdmin);

module.exports = router;
