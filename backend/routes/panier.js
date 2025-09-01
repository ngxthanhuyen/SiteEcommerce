const express = require('express');
const router = express.Router();
const Panier = require('../models/Panier');
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

// Route POST pour ajouter au panier
router.post('/add', authenticate, async (req, res) => {
  try {    
    const { produitId, name, price, img } = req.body;
    const userId = req.userId;

    if (!produitId) {
      return res.status(400).json({ error: 'ID produit manquant' });
    }

    let panier = await Panier.findOne({ userId }) || new Panier({ userId, produits: [] });
    
    const produitExistant = panier.produits.find(p => p.produitId === produitId);
    
    if (produitExistant) {
      produitExistant.quantite += 1;
    } else {
      panier.produits.push({ produitId, name, price, img, quantite: 1 });
    }

    await panier.save();
    res.json(panier);

  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
});


router.get('/', authenticate, async (req, res) => {
  try {
    const panier = await Panier.findOne({ userId: req.userId }) || { produits: [], totalPrice: 0, count: 0}; 
    res.json({
      produits: panier.produits,
      totalPrice: panier.totalPrice || 0,
      count: panier.count || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dans votre router panier
router.put('/update-quantity', authenticate, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const panier = await Panier.findOne({ userId: req.userId });

    if (!panier) return res.status(404).json({ error: 'Panier non trouvé' });

    // Trouver et mettre à jour le produit
    const produit = panier.produits.find(p => p.produitId === productId);
    if (produit) {
      produit.quantite = quantity;
      await panier.save(); 
    }

    res.json(panier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/remove/:productId', authenticate, async (req, res) => {
    try {
        const { productId } = req.params; //on récupère l'ID du produit à supprimer depuis l'url
        const userId = req.userId;
        if (!productId) {
            return res.status(400).json({ error: 'ID produit manquant' });
        }
        const panier = await Panier.findOne({ userId });
        if (!panier) {
            return res.status(404).json({ error: 'Panier non trouvé' });
        }
        //On ne garde que les produits dont l'ID ne correspond pas à productId
        panier.produits = panier.produits.filter(p => p.produitId !== productId);
        await panier.save();
        res.json({ message: 'Produit retiré du panier', panier });
    } catch (err) {
        console.error('Erreur lors de la suppression du produit du panier:', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
})  
module.exports = router;