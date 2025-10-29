import React, { useState, useEffect } from 'react';
import './ProduitsSection.css';
import { useNavigate } from 'react-router-dom';

const ProduitsSection = ({ title, products, offset = 0 }) => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [wishlistItems, setWishlistItems] = useState([]);
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
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour ajouter au panier.");
      return navigate('/login');
    }   
    try {
      const response = await fetch('http://localhost:4000/api/panier/add', {
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
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erreur inconnue');
      }
      const data = await response.json();
      console.log('Produit ajouté au panier:', data);
      window.dispatchEvent(new CustomEvent('stateChange'));

      //Affiche modal avant redirection
      setModalMessage("Produit ajouté au panier !");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/panier');
      }, 2000);

    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
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
          img: item.img, 
          likes: 1
        })
      });

      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 400 && responseData.message === "Produit déjà dans la liste d'envie") {
          setModalMessage("Ce produit est déjà dans votre liste d'envies !");
          setShowModal(true);
          setTimeout(() => setShowModal(false), 2000);
          return;
        }
        throw new Error(responseData.error || "Erreur lors de l'ajout");
      }
      // Ajouter le produit à la liste locale
      setWishlistItems(prev => [...prev, { produitId: item.id }]);
      console.log("Produit ajouté à la liste d'envies:", responseData);
      setModalMessage("Ce produit est ajouté à votre liste d'envies !");
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/liste-envie');
      }, 2000);

      window.dispatchEvent(new CustomEvent("stateChange"));

    } catch (err) {
      console.error("Erreur lors de l'ajout à la liste d'envies:", err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleRemove = async (produitId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return navigate("/login");

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

  return (
    <>
      <section className="produitsSection">
        <center><h3 className="product-title">{title}</h3></center>
        <div className="product-card">
          {products.map((p, idx) => {
            const globalIdx = offset + idx;
            const isSecondProduct = globalIdx === 1;
            const isFourthProduct = globalIdx === 3;
            const isLastProduct = globalIdx === 5;
            const isSpecialRating = isSecondProduct || isFourthProduct || isLastProduct;

            return (
              <div className="product-grid" key={globalIdx}>
                <div className="showcase-banner">
                  <img
                    className={`product-img ${isSecondProduct ? 'large-img' : ''}`}
                    src={p.img}
                    alt={p.name}
                  />
                  <p className="product-badge angle black">{p.badge}</p>
                  <div className="showcase-actions">
                    <button className={`btn-action ${isInWishlist(p.id) ? 'in-wishlist' : ''}`} onClick={() => addToWishList(p)}>
                      <ion-icon name={isInWishlist(p.id) ? "heart" : "heart-outline"}></ion-icon>
                    </button>
                    <button className="btn-action" onClick={() => addToCart(p)}>
                      <ion-icon name="bag-handle-outline"></ion-icon>
                    </button>
                  </div>
                  <button className="cart-btn" onClick={() => addToCart(p)}>
                    Ajouter au panier - {p.price}€
                  </button>
                </div>

                <div className="product-showcase">
                  <a href="#" className="product-showcase-category">{p.category}</a>
                  <a href="#"><h3 className="product-showcase-title">{p.name}</h3></a>
                  <div className="showcase-rating">
                    {isSpecialRating ? (
                      <>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                      </>
                    ) : (
                      <>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star"></ion-icon>
                        <ion-icon name="star-outline"></ion-icon>
                      </>
                    )}
                  </div>
                  <div className="price-box">
                    <p className="price">{p.price}€</p>
                    {p.oldPrice && <del>{p.oldPrice}€</del>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ✅ Modal de notification */}
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

export default ProduitsSection;
