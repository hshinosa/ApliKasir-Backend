const express = require('express');
const router = express.Router();
const riwayatAdminController = require('../controllers/riwayatAdminController');

router.get('/', riwayatAdminController.getAllRiwayatAdmin);
router.get('/admin/:id', riwayatAdminController.getRiwayatAdminByAdminId);
router.post('/', riwayatAdminController.createRiwayatAdmin);

module.exports = router;