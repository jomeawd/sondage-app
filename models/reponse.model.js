const mongoose = require('mongoose');

const reponseSchema = new mongoose.Schema({
  sondageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sondage' },
  questionId: { type: mongoose.Schema.Types.ObjectId },
  valeur: String,
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Reponse', reponseSchema);
