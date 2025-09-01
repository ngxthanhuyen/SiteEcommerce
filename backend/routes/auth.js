const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

router.use(express.urlencoded({ extended: true }));

router.use(express.json());

//Configure multer pour gérer les uploads de fichiers
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, file.originalname)   
});
const upload = multer({
    storage: multerStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, 
      files: 1
    }
});
//Inscription
router.post('/register', upload.single('photo'), async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            photo_profil: req.file ? req.file.filename : 'avatar.jpg'
        })

        const savedUser = await user.save()
        console.log("Utilisateur enregistré:", savedUser) 

        res.status(201).json({
            message: 'Inscription réussie',
            user: {
                name: savedUser.name,
                email: savedUser.email,
                photo_profil: savedUser.photo_profil,
                creation_date: savedUser.creation_date
            }
        })
    } catch (err) {
        console.error("Erreur complète:", err)
        if (err.code === 11000) { 
            return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà !" })
        }
        res.status(500).json({ 
            message: "Erreur serveur",
            error: err.message 
        })
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
        res.json({
            token,
            _id: user._id,
            name: user.name,
            email: user.email,
            photo_profil: user.photo_profil,
            creation_date: user.creation_date
        });    
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur lors de l'inscription"});
    }
});

router.use((req, res, next) => {
    // Force le Content-Type à JSON pour toutes les réponses de l'API
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Modifiez votre route editprofil comme ceci :
router.put('/editprofil', upload.single('photo'), async (req, res) => {
  try {
    //Vérification du token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    //Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mise à jour des données
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    // Gestion de la photo
    if (req.body.deletePhoto === 'true') {
      user.photo_profil = 'avatar.jpg';
    } else if (req.file) {
      user.photo_profil = req.file.filename;
    }

    // 5. Sauvegarde
    await user.save();

    // 6. Réponse
    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        photo_profil: user.photo_profil
      }
    });

  } catch (err) {
    console.error('Erreur:', err);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: err.message 
    });
  }
});

module.exports = router;
