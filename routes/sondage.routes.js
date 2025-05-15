const express = require('express');
const router = express.Router();
const sondageController = require('../controllers/sondage.controller');
const auth = require('../middlewares/auth.middleware');

// Exemple de route
router.post('/', auth, sondageController.createSondage);
router.put('/:id', auth, sondageController.updateSondage);
router.delete('/:id', auth, sondageController.deleteSondage);
router.get('/public', sondageController.getAllPublicSondages);


module.exports = router;

