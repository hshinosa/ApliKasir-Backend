const express = require('express');
const router = express.Router();
const kreditController = require('../controllers/kreditController');

router.get('/', kreditController.getAllKredit);
router.get('/:id', kreditController.getKreditById);
router.post('/', kreditController.createKredit);
router.put('/:id', kreditController.updateKredit);
router.delete('/:id', kreditController.deleteKredit);

module.exports = router;