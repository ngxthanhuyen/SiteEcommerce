const mongoose = require('mongoose');

const produitPanierSchema = new mongoose.Schema({
    produitId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    quantite: { type: Number, default: 1 },
    likes: { type: Number, default: 0 }  
});

const panierSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    produits: [produitPanierSchema], 
    totalPrice: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
}, { timestamps: true });


module.exports = mongoose.model('Panier', panierSchema);