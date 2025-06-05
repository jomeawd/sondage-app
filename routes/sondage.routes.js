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
        return res.status(400).json({ message: 'Questions invalides (doivent être un tableau)' });
      }
  
      // Validation simple sur chaque question
      for (const [i, q] of questions.entries()) {
        if (!q.text || typeof q.text !== 'string' || q.text.trim() === '') {
          return res.status(400).json({ message: `La question #${i + 1} doit avoir un texte valide` });
        }
        if (!q.type || !['ouverte', 'qcm'].includes(q.type)) {
          return res.status(400).json({ message: `Type de question invalide pour la question #${i + 1}` });
        }
        if (!Array.isArray(q.reponses)) {
          q.reponses = [];
        }
      }
  
      const sondage = await Sondage.findById(req.params.id);
      if (!sondage) {
        return res.status(404).json({ message: 'Sondage introuvable' });
      }
  
      sondage.questions = questions;
  
      console.log('Sauvegarde des questions:', questions);
  
      await sondage.save();
      res.json({ message: 'Questions mises à jour' });
    } catch (err) {
      console.error('Erreur sauvegarde questions:', err);
      res.status(500).json({ message: 'Erreur serveur', error: err.message });
    }
  });
  
  

module.exports = router;

