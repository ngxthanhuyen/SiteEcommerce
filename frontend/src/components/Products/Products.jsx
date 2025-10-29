import React, { useState, useEffect } from 'react';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import { produits as produitsData } from '../../data/data';

const Products = () => {
  const nouveautes = produitsData.filter(produit => produit.tag === "nouveautes");
  const trending = produitsData.filter(produit => produit.tag === "trending");
  const bestsellers = produitsData.filter(produit => produit.tag === "bestsellers");
  const navigate = useNavigate();
  
  const [produits, setProduits] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Charger la liste d'envies au démarrage
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:4000/api/liste-envie', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data.produits || []);
        }
      } catch (err) {
        console.error('Erreur chargement liste envies:', err);
      }
    };
    fetchWishlist();
  }, []);

  const addToCart = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const response = await fetch('http://localhost:4000/api/panier/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          produitId: item.id,
          name: item.name,
          price: item.price,
          img: item.img, 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur inconnue');
      }
      window.dispatchEvent(new CustomEvent('stateChange'));
      navigate('/panier'); 

      const data = await response.json();
      console.log('Réponse du serveur:', data);
    } catch (err) {
      console.error('Erreur détaillée:', err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const addToWishList = async (item) => {
    if (isInWishlist(item.id)) {
      await handleRemove(item.id);
      setWishlistItems(prev => prev.filter(p => p.produitId !== item.id));
      setModalMessage("Ce produit est retiré de votre liste d'envies !");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1000);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour ajouter à la liste d'envies.");
      return navigate('/login');
    }
    try {

      const response = await fetch('http://localhost:4000/api/liste-envie/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          produitId: item.id,
          name: item.name,
          price: item.price,
          img: item.img
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        if (response.status === 400 && responseData.message === "Produit déjà dans la liste d'envie") {
          // Afficher la modal pour produit déjà ajouté
          setModalMessage("Ce produit est déjà dans votre liste d'envies !");
          setShowModal(true);
          setTimeout(() => setShowModal(false), 2000);
          return;
        }
        throw new Error(responseData.error || "Erreur lors de l'ajout");
      }
      
      // Ajouter le produit à la liste locale
      setWishlistItems(prev => [...prev, { produitId: item.id }]);
      
      // Afficher la modal de succès
      setModalMessage("Ce produit est ajouté à votre liste d'envies !");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      navigate('/liste-envie'); 

      console.log("Produit ajouté à la liste d'envies:", responseData);
      window.dispatchEvent(new CustomEvent("stateChange"));
      
    } catch (err) {
      console.error("Erreur:", err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleRemove = async (produitId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return navigate('/login');
      }
     const res = await fetch(`http://localhost:4000/api/liste-envie/remove/${produitId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            if (!res.ok) throw new Error("Erreur suppression produit");

            const data = await res.json();
            setProduits(data.produits || []);
            window.dispatchEvent(new CustomEvent('stateChange'));
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

  // Vérifier si un produit est dans la liste d'envies
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.produitId === productId);
  };

  const renderSection = (title, items) => (
    <div className="product-showcase">
      <h2 className="title">{title}</h2>
      <div className="showcase-wrapper">
        <div className="showcase-container">
          {items.map((item, index) => (
            <div className="showcase" key={index}>
              <div className="showcase-img-box">
                <img src={item.img} alt={item.name} className="showcase-img" />
              </div>
              <div className="showcase-content">
                <h4 className="showcase-title">{item.name}</h4>
                <div className="showcase-category">{item.category}</div>
                <div className="price-box">
                  <p className="price">{item.price}€</p>
                  <del>{item.oldPrice}€</del>
                </div>
              </div>
              <div className="button-container">
                <button className={`btn-action ${isInWishlist(item.id) ? 'in-wishlist' : ''}`} onClick={() => addToWishList(item)}>
                  <ion-icon name={isInWishlist(item.id) ? "heart" : "heart-outline"}></ion-icon>
                </button>
                <button className="btn-action" onClick={() => addToCart(item)}>
                  <ion-icon name="bag-handle-outline"></ion-icon>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="product">
        {renderSection("Nouveautés", nouveautes)}
        {renderSection("Trending", trending)}
        {renderSection("Best Sellers", bestsellers)}
      </div>

      {/* Modal de notification */}
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
    </>
  );
};

export default Products;