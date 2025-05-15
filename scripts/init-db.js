const mongoose = require("mongoose");
const Sondage = require("../models/sondage.model");

mongoose.connect("mongodb://localhost:27017/sondage-app");

const init = async () => {
  await Sondage.deleteMany();

  await Sondage.create({
    nom: "Sondage Test",
    createur: new mongoose.Types.ObjectId(),
    questions: [
      { intitule: "Quel est ton plat préféré ?", type: "ouverte" },
      { intitule: "Types de cuisines ?", type: "qcm", reponses: ["Italienne", "Japonaise", "Mexicaine"] }
    ]
  });

  console.log("Base de données initialisée !");
  process.exit();
};

init();
