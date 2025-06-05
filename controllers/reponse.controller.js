const Reponse = require('../models/reponse.model');

exports.repondre = async (req, res) => {
  const { sondageId, reponses } = req.body;

  if (!Array.isArray(reponses) || reponses.length === 0) {
    return res.status(400).json({ message: 'Aucune réponse fournie' });
  }

  try {
    const saved = await Promise.all(reponses.map(rep => {
      return Reponse.create({
        sondageId,
        questionId: rep.questionId,
        valeur: rep.valeur,
        utilisateur: req.user.id
      });
    }));

    res.status(201).json({ message: 'Réponses enregistrées', saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
