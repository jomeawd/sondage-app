const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const sondageRoutes = require('./routes/sondage.routes');
const reponseRoutes = require('./routes/reponse.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔽 Serve les fichiers HTML depuis 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/sondages', sondageRoutes);
app.use('/api/reponses', reponseRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(5000, () => console.log('Serveur sur http://localhost:5000'));
  })
  .catch((err) => console.error(err));
