const express = require('express');
const router = express.Router();
const reponseController = require('../controllers/reponse.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, reponseController.repondre);

module.exports = router;
