import React, { useState, useEffect } from 'react';
import './Offer.css';
import {useNavigate} from 'react-router-dom';

const Offer = () => {
  // On choisit une date cible pour la promotion (24h après le chargement de la page)
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 1);

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimer = calculateTimeLeft();
      setTimeLeft(newTimer);
      if (newTimer.expired) {
        setShowModal(true);
        clearInterval(timer);
      }
    }, 1000);
    //On nettoie l'intervalle pour éviter qu'il continue de tourner en mémoire au changement de page
    return () => clearInterval(timer);
  }, []);

  const navigate = useNavigate();
  const addToCart = async () => {
    if (timeLeft.expired) {
      setShowModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Vous devez être connecté pour acheter.");
        return;
      }

      const response = await fetch('http://localhost:4000/api/panier/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          produitId: 'promo1',
          name: 'Organic Body Care',
          price: 9.99,
          img: 'https://i.pinimg.com/474x/12/00/b3/1200b360dc5fb8d3740a60568292390b.jpg',
        }),
      });
      if (response.ok) {
          window.dispatchEvent(new CustomEvent('stateChange'));
          navigate('/panier'); // Redirection vers la page panier
        }

      if (!response.ok) throw new Error('Erreur ajout panier');
      const data = await response.json();
      console.log("Produit ajouté :", data);
    } catch (err) {
      console.error(err);
      alert("Impossible d'ajouter au panier.");
    }
  };


  return (
    <section className="offer">
      <div className="container">
        <figure className="offer-banner">
          <img
            src="https://i.pinimg.com/474x/12/00/b3/1200b360dc5fb8d3740a60568292390b.jpg"
            width="290"
            alt="Produit 1"
          />
          <img
            src="https://i.pinimg.com/474x/0d/97/dd/0d97ddfde32f9c822692246e5aa8a289.jpg"
            width="380"
            alt="Produit 2"
          />
        </figure>
        <div className="offer-content">
          <p className="offer-subtitle">
            <span className="span">Special Offer</span>
            <span className="badge">-50%</span>
          </p>
          <h2 className="section-title">Organic Body Care</h2>
          <p className="section-text">
            Fabriqués à partir d'ingrédients naturels, propres et non toxiques,
            nos produits sont conçus pour tout le monde.
          </p>
          <div className="countdown">
            <span className="time">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="time">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="time">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="time">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
          <button className="btn" onClick = {addToCart}>Seulement 9.99€</button>
        </div>
      </div>
      {/* Modal pour l'expiration de l'offre */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Offre expirée</h3>
            <p>Désolé, cette offre n'est plus disponible.</p>
            <button className="btn" onClick={() => setShowModal(false)}>Fermer</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Offer;
