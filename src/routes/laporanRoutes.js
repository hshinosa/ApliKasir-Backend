const express = require('express');
const laporanController = require('../controllers/laporanController');
const router = express.Router();

router.get('/', laporanController.getAllLaporan);
router.get('/:id', laporanController.getLaporanById);
router.post('/', laporanController.createLaporan);
router.put('/:id', laporanController.updateLaporan);
router.delete('/:id', laporanController.deleteLaporan);

module.exports = router;