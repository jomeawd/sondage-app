const Reponse = require('../models/reponse.model');
const Sondage = require('../models/sondage.model');

exports.repondre = async (req, res) => {
  const { sondageId } = req.params;
  const { reponses } = req.body;


  if (!Array.isArray(reponses) || reponses.length === 0) {
    return res.status(400).json({ message: 'Aucune réponse fournie' });
  }

  try {
    // Vérifier que le sondage existe
    const sondage = await Sondage.findById(sondageId);
    if (!sondage) {
      return res.status(404).json({ message: 'Sondage introuvable' });
    }

    // Vérifier que l'utilisateur n'est pas le créateur du sondage
    if (sondage.createur.toString() === req.user.id) {
      return res.status(403).json({ message: 'Vous ne pouvez pas répondre à votre propre sondage' });
    }

    // Vérifier que l'utilisateur n'a pas déjà répondu à ce sondage
    const existingReponse = await Reponse.findOne({
      sondageId: sondageId,
      utilisateur: req.user.id
    });

    if (existingReponse) {
      return res.status(400).json({ message: 'Vous avez déjà répondu à ce sondage' });
    }

    const saved = await Promise.all(reponses.map(rep => {
      return Reponse.create({
        sondageId,
        questionId: rep.questionId,
        valeur: rep.reponse || rep.valeur, // Support both 'reponse' and 'valeur'
        utilisateur: req.user.id
      });
    }));

    res.status(201).json({ message: 'Réponses enregistrées', saved });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement des réponses:', err);
    res.status(500).json({ error: err.message });
  }
};