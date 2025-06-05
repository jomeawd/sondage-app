const Sondage = require('../models/sondage.model');

exports.createSondage = async (req, res) => {
  try {
    const sondage = await Sondage.create({ ...req.body, createur: req.user.id });
    res.status(201).json(sondage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPublicSondages = async (req, res) => {
  const sondages = await Sondage.find({}, { questions: 0 });
  res.json(sondages);
};

exports.updateSondage = async (req, res) => {
  const sondage = await Sondage.findById(req.params.id);
  if (!sondage || sondage.createur.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' });
  }
  Object.assign(sondage, req.body);
  await sondage.save();
  res.json(sondage);
};

exports.deleteSondage = async (req, res) => {
  const sondage = await Sondage.findById(req.params.id);
  if (!sondage || sondage.createur.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' });
  }
  await sondage.deleteOne();
  res.json({ message: 'Sondage supprimé' });
};

exports.getAllSondages = async (req, res) => {
    try {
      const sondages = await Sondage.find({ createur: req.user.id });
      res.status(200).json(sondages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
