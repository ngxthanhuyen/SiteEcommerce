const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Inscription
router.post('/register', async(req, res) => {
    try {
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User ({name, email, password: hashedPassword});
        await user.save();
        res.status(201).json({message: 'Utilisateur enregistré avec succès'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur lors de l'inscription"});
    }
})

//Connexion
router.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne ({email});
        if (!user) return res.status(400).json({message: 'Utilisateur non trouvé'});

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({message: "Mot de passe incorrect"});

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        res.json({token, name: user.name});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur lors de l'inscription"});
    }
});

module.exports = router;
