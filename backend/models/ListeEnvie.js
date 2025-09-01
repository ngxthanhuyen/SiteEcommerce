const mongoose = require('mongoose');

const produitListeEnvieSchema = new mongoose.Schema({
    produitId: { type: String, required: true },
    name: { type: String, required: true }, 
    price: { type: Number, required: true },
    img: { type: String, required: true }
});
const listeEnvieSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    produits: [produitListeEnvieSchema], 
}, { timestamps: true });

module.exports = mongoose.model('ListeEnvie', listeEnvieSchema);