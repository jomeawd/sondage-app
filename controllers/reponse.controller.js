const Reponse = require('../models/reponse.model'); // Modèle Mongoose à créer
const Sondage = require('../models/sondage.model'); // Modèle Sondage pour vérifier existence

// POST /api/reponses/:id (id = id du sondage)
async function submitReponse(req, res) {
  const sondageId = req.params.id;
  const utilisateurId = req.user._id; // supposé fourni par le middleware auth
  const { reponses } = req.body; // tableau des réponses [{ question_id, reponse }, ...]

  try {
    // Vérifier que le sondage existe
    const sondage = await Sondage.findById(sondageId);
    if (!sondage) {
      return res.status(404).json({ message: "Sondage introuvable" });
    }

    // Créer la réponse dans la BDD
    const nouvelleReponse = new Reponse({
      sondage_id: sondageId,
      utilisateur_id: utilisateurId,
      reponses: reponses,
    });

    await nouvelleReponse.save();

    res.status(201).json({ message: "Réponse enregistrée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

module.exports = { submitReponse };

