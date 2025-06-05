const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  intitule: String,
  type: { type: String, enum: ['ouverte', 'qcm'] },
  reponses: [String]
});

const sondageSchema = new mongoose.Schema({
  nom: { type: String, unique: true, required: true },
  createur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [questionSchema],
  estPublic: { type: Boolean, default: false }
});

module.exports = mongoose.model('Sondage', sondageSchema);
