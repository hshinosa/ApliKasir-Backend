const express = require('express');
const router = express.Router();
const penggunaController = require('../controllers/penggunaController');

router.get('/', penggunaController.getAllPengguna);
router.get('/:id', penggunaController.getPenggunaById);
router.get('/:id/pelanggan', penggunaController.showCustomer);
router.put('/:id', penggunaController.updatePengguna);
router.delete('/:id', penggunaController.deletePengguna);

module.exports = router;