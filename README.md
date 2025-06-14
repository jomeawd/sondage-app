# Sondage App

Une application complète de création et de réponse à des sondages en ligne, avec authentification JWT, stockage MongoDB, frontend HTML/JS et backend Node.js/Express.

## Fonctionnalités

- Authentification (inscription, connexion)
- Création de sondages avec questions ouvertes ou QCM
- Réponse aux sondages par des utilisateurs authentifiés
- Prévention des réponses multiples
- Gestion des permissions (le créateur ne peut pas répondre à son propre sondage)
- Interface frontend simple en HTML/JS
- Backend Express + MongoDB

---

## Technologies

- Backend : Node.js, Express
- Base de données : MongoDB (via Mongoose)
- Authentification : JWT
- Frontend : HTML + JavaScript Vanilla
- Sécurité : bcrypt
- Autres : dotenv, cors, nodemon

---

## Structure du projet

```
.
├── client/               # Frontend HTML/JS
├── controllers/          # Contrôleurs Express
├── middlewares/          # Auth middleware (JWT)
├── models/               # Schémas Mongoose
├── public/               # Pages HTML statiques
├── routes/               # Fichiers de routes Express
├── config/db.js          # Connexion MongoDB
├── server.js             # Point d’entrée du serveur
├── .env                  # Variables d’environnement
└── README.md             # Ce fichier
```

---

## Installation

### 1. Clone du dépôt

```bash
git clone https://github.com/jomeawd/sondage-app
cd sondage-app
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de l’environnement

Créer un fichier `.env` à la racine :

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/sondage-app
JWT_SECRET=ton_secret_jwt
```

### nstallation de MongoDB (macOS via Homebrew)

```bash
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
brew services list
```

### Utilisation de la base de données

Lancer le shell MongoDB :

```bash
mongosh
```

Puis :

```javascript
use sondage-app
show collections
db.users.find()
db.sondages.find()
db.reponses.find()
```

### Lancement du serveur

En mode normal :

```bash
node server.js
```

En mode développement (auto-reload) :

```bash
npx nodemon server.js
```

Le serveur est accessible sur :  
👉 http://localhost:5001

---

## Tests manuels

Tu peux utiliser :

- Postman pour tester les routes
- Les fichiers HTML dans `public/` (ex: `repondre-sondage.html`) directement dans un navigateur
