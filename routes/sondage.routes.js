const express = require('express');
const router = express.Router();
const sondageController = require('../controllers/sondage.controller');
const auth = require('../middlewares/auth.middleware');
const Sondage = require('../models/sondage.model');

// Exemple de route
router.post('/', auth, sondageController.createSondage);
router.put('/:id', auth, sondageController.updateSondage);
router.delete('/:id', auth, sondageController.deleteSondage);
router.get('/public', sondageController.getAllPublicSondages);

router.get('/', auth, sondageController.getAllSondages);

router.get('/:id', sondageController.getSondageById);

// GET sondage complet
router.get('/:id', async (req, res) => {
    try {
      const sondage = await Sondage.findById(req.params.id);
      if (!sondage) return res.status(404).json({ message: 'Sondage introuvable' });
      res.json(sondage);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // PUT update questions
  router.put('/:id/questions', async (req, res) => {
    try {
      const { questions } = req.body;
      if (!Array.isArray(questions)) {
        return res.status(400).json({ message: 'Questions invalides' });
      }
      const sondage = await Sondage.findById(req.params.id);
      if (!sondage) {
        return res.status(404).json({ message: 'Sondage introuvable' });
      }
  
      console.log('Questions reçues avant sauvegarde:', questions);
      sondage.questions = questions;
      await sondage.save();
      res.json({ message: 'Questions mises à jour' });
    } catch (err) {
      console.error('Erreur sauvegarde questions:', err);
      res.status(500).json({ message: 'Erreur serveur', error: err.message, stack: err.stack });
    }
  });
  
  
  

module.exports = router;

