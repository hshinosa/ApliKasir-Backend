const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

// Endpoint untuk produk
router.get('/', produkController.getAllProduk);
router.get('/:id', produkController.getProdukById);
router.put('/:id', produkController.updateProduk);
router.delete('/:id', produkController.deleteProduk);

module.exports = router;
