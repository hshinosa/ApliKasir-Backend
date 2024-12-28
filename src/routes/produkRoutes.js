const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const multer = require("../middleware/multer");

router.get('/', produkController.getAllProduk);
router.get('/:id', produkController.getProdukById);
router.post('/', multer.single('gambar_produk'), produkController.createProduk);
router.put('/:id', multer.single('new_gambar_produk'), produkController.updateProduk);
router.delete('/:id', produkController.deleteProduk);

module.exports = router;