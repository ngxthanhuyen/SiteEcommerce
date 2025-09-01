//Point d'entrée principal du serveur
const express = require('express');
const mongoose = require('mongoose'); //Librairie qui facillite l'interaction entre Node.js et MongoDB
//Permet au backend d'accepter des requêtes venant d'un autre domaine
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); //autorise les requêtes cross-orgin
app.use(express.json()); //lire les données envoyées en JSON 

//Route test
app.get('/', (req, res) => {
    res.send('Backend opérationnel !');
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.use('/uploads', express.static('uploads')); //Permet d'accéder aux fichiers uploadés

const panierRoutes = require('./routes/panier');
app.use('/api/panier', panierRoutes);

const listeEnvieRoutes = require('./routes/liste-envie');
app.use('/api/liste-envie', listeEnvieRoutes);

//Connexion à Mongo
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connexion réussie à MongoDB"))
    .catch(err => console.error('Erreur MongoDB: ', err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));