const express = require('express');
const router = express.Router();
const { submitReponse } = require('../controllers/reponse.controller'); // ta fonction
const auth = require('../middlewares/auth.middleware');

router.post('/:id', auth, submitReponse); // utilise la fonction importée

module.exports = router;
