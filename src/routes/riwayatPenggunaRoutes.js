const express = require('express');
const router = express.Router();
const riwayatPenggunaController = require('../controllers/riwayatPenggunaController');

router.get('/', riwayatPenggunaController.getAllRiwayatPengguna);
router.get('/pengguna/:id', riwayatPenggunaController.getRiwayatPenggunaByPenggunaId);
router.post('/', riwayatPenggunaController.createRiwayatPengguna);

module.exports = router;