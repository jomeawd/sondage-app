const mongoose = require('mongoose');

const reponseSchema = new mongoose.Schema({
  sondage_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sondage' },
  utilisateur_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reponses: [
    {
      question_id: mongoose.Schema.Types.ObjectId,
      reponse: mongoose.Schema.Types.Mixed
    }
  ]
});

module.exports = mongoose.model('Reponse', reponseSchema);
