const express = require('express');
const router = express.Router();
const ListeEnvie = require('../models/ListeEnvie');
const jwt = require('jsonwebtoken');

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

// Récupérer la liste d'envies
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const listeEnvie = await ListeEnvie.findOne({ userId });

    if (!listeEnvie) {
      return res.json({ produits: [] }); 
    }

    res.json(listeEnvie);
  } catch (err) {
    console.error("Erreur GET /liste-envie :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Ajouter un produit
router.post("/add", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { produitId, name, price, img, likes } = req.body;

    let listeEnvie = await ListeEnvie.findOne({ userId });
    if (!listeEnvie) {
      listeEnvie = new ListeEnvie({ userId, produits: [] });
    }

    // Vérifier si le produit existe déjà
    const exists = listeEnvie.produits.find(p => p.produitId === produitId);
    if (exists) {
      return res.status(400).json({ message: "Produit déjà dans la liste d'envie" });
    }

    listeEnvie.produits.push({ produitId, name, price, img, likes });
    await listeEnvie.save();

    res.json(listeEnvie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


router.delete('/remove/:produitId', authenticate, async (req, res) => {
  try {
    const { produitId } = req.params;
    const userId = req.userId;

    let listeEnvie = await ListeEnvie.findOne({ userId });
    if (!listeEnvie) return res.status(404).json({ error: 'Liste d\'envies introuvable' });

    const produitExistant = listeEnvie.produits.find(p => p.produitId === produitId);
    if (!produitExistant) {
      return res.status(400).json({ error: 'Produit non présent dans la liste d\'envies' });
    }

    // Retirer le produit de la wishlist
    listeEnvie.produits = listeEnvie.produits.filter(p => p.produitId !== produitId);
    await listeEnvie.save();


    res.json(listeEnvie);

  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});


module.exports = router;
