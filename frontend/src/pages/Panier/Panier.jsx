import React, { useEffect, useState } from 'react';
import './Panier.css';
import poubelle from '../../components/assets/images/poubelle.png';
import panierVide from '../../components/assets/images/panierVide.svg';
import { Footer } from '../../components/Footer/Footer';

export const Panier = () => {
  const [panier, setPanier] = useState({ 
    produits: [], 
    total: 0 
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/panier/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erreur serveur');
        const data = await response.json();
        
        setPanier({
          produits: data.produits || [],
          total: data.totalPrice|| 0
        });
      } catch (err) {
        console.error('Erreur fetch panier:', err);
        setPanier({
          produits: [],
          total: 0
        });
      }
    };

    fetchPanier();
  }, []);

  // On calcule le sous-total directement
  const total = panier.produits.reduce((sum, item) => sum + (item.price * item.quantite), 0);
  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter');
        return;
      }

      newQuantity = Math.max(1, newQuantity); //Quantité minimale de 1

      const response = await fetch('http://localhost:4000/api/panier/update-quantity', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          productId, 
          quantity: newQuantity 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur serveur');
      }

      const updatedCart = await response.json();
      
      // Mise à jour du state
      setPanier({
        produits: updatedCart.produits,
        total: updatedCart.totalPrice
      });

      // Mise à jour du header
      window.dispatchEvent(new CustomEvent('stateChange'));

    } catch (error) {
      console.error("Erreur mise à jour quantité:", error.message);
      alert(`Erreur: ${error.message}`);
    }
  };
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour supprimer un produit du panier.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/panier/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du produit');
      }

      const data = await response.json();

      // Mise à jour du panier local
      setPanier(prevPanier => ({
        ...prevPanier,
        produits: prevPanier.produits.filter(p => p.produitId !== productId),
        total: prevPanier.total - (data.price * data.quantite)
      }));

      // Affichage du modal
      setModalMessage("Ce produit a été supprimé de votre panier avec succès !");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);

      // Mettre à jour le header
      window.dispatchEvent(new CustomEvent('stateChange'));

    } catch (err) {
      console.error('Erreur suppression produit:', err);
      alert(`Erreur: ${err.message}`);
    }
  }

  return (
    <>
      {panier.produits.length === 0 ? 
        (<div className='panier-vide-container'>
          <div className="panier-vide">
            <img src={panierVide} alt="Panier vide" className="panier-vide-img" />
            <p className="panier-title">Votre panier est vide</p>
            <button className="panier-vide-btn" onClick={() => window.location.href = '/produits'}>
              Explorer les produits
            </button>
          </div>
        </div>        
        ) : 
        (<>
          <div className="panierArticles">
            <div className="panierArticles-container-principal">
                <p>Produits</p>
                <p>Nom du produit</p>
                <p>Prix</p>
                <p>Quantité</p>
                <p>Total</p>
                <p>Supprimer</p>
            </div>
            <hr/>
            {panier.produits.map((p, i) => (
            <div key={i}>
                <div className="panierArticles-container">
                    <img src={p.img} width="50" className='panierIcon-produit-icon'/>
                    <p>{p.name}</p>
                    <p>{p.price}€</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(p.produitId, p.quantite - 1)} disabled={p.quantite <= 1}>-</button>   
                      <span className='panierArticles-quantite'>{p.quantite}</span>
                      <button onClick={() => updateQuantity(p.produitId, p.quantite + 1)}>+</button>
                    </div>                
                    <p>{(p.price * p.quantite).toFixed(2)}</p>
                    <button type="button" className="supprimer-article" onClick={() => removeFromCart(p.produitId)} style={{ background: `url(${poubelle}) no-repeat center center`, backgroundSize: 'contain', width: '26px', height: '26px', border: 'none', cursor: 'pointer', margin: '2px auto'}} aria-label="Supprimer"/>                           
                </div>
                <hr/>
            </div>
        ))}
          <div className="panierArticles-bas">
            <div className="panierArticles-total">
              <h1>Total du panier</h1>
              <div>
                <div className="panierArticles-total-element">
                  <p>Sous-total</p>
                  <p style={{ fontWeight: 'bold'}}>€{total.toFixed(2)}</p>
                </div>
                <hr />
                <div className="panierArticles-total-element">
                  <p>Frais de livraison</p>
                  <p style={{ fontWeight: 'bold'}}>Gratuit</p>
                </div>
                <hr />
                <div className="panierArticles-total-element">
                  <p>Total</p>
                  <p style={{ fontWeight: 'bold'}}>€{total.toFixed(2)}</p>
                </div>
              </div>
              <button className="panierArticles-btn">Valider la commande</button>
            </div>
            <div className="panierArticles-codepromo">
              <p>Si vous avez un code de promotion, saisissez le ici</p>
              <div className="panierArticles-codepromo-input">
                <input type="text" placeholder='Code de promo' />
                <button className='envoyer-codepromo'>Appliquer</button>
              </div>
            </div>
          </div>
        </div>  
      </>     
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <ion-icon name="checkmark-circle"></ion-icon>
            </div>
            <p>{modalMessage}</p>
          </div>
        </div>
        )}
    <Footer></Footer>
    </>
  )
};

export default Panier;
