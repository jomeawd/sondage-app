const Sondage = require('../models/sondage.model');

exports.createSondage = async (req, res) => {
    try {
      const sondage = await Sondage.create({ ...req.body, createur: req.user.id });
      res.status(201).json(sondage);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ message: 'Un sondage avec ce nom existe déjà.' });
      }
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.getAllPublicSondages = async (req, res) => {
    try {
      const sondages = await Sondage.find({ estPublic: true }, { questions: 0 });
      res.json(sondages);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.updateSondage = async (req, res) => {
    try {
      const sondage = await Sondage.findById(req.params.id);
      if (!sondage || sondage.createur.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Non autorisé' });
      }
      Object.assign(sondage, req.body);
      await sondage.save();
      res.json(sondage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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
    const sondages = await Sondage.find().populate('createur', 'email');
    res.status(200).json(sondages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
  
  exports.getSondageById = async (req, res) => {
    try {
      const sondage = await Sondage.findById(req.params.id);
      if (!sondage) return res.status(404).json({ message: 'Sondage introuvable' });
      res.json(sondage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  