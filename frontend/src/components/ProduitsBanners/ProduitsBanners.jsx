import React, {useState, useEffect} from 'react'
import './ProduitsBanners.css';
import {slides} from '../../data/data';
import { useNavigate } from 'react-router-dom';

const ProduitsBanners = () => {

    const navigate = useNavigate();

    const [wishlistItems, setWishlistItems] = useState([]);
    const [produits, setProduits] = useState([]);
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
    const addToCart = async(item) => {
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
            window.dispatchEvent(new CustomEvent('stateChange'));
            navigate('/panier'); 

            const data = await response.json();
            console.log('Réponse du serveur:', data);
        } catch (err) {
            console.error('Erreur détaillée:', err);
            alert(`Erreur: ${err.message}`);
        }
    }
    return (
        <>
        <div className="produitsBanners">
            <div className="slider-container has-scrollbar">
                {slides.map((item, i) => (
                <div className="slider-item" key={i}>
                    <img src={item.img} className="produitsBanners-img" alt={item.subtitle} />
                    <button className={`btn-action ${isInWishlist(item.id) ? 'in-wishlist' : ''}`} onClick={() => addToWishList(item)}>
                        <ion-icon name={isInWishlist(item.id) ? "heart" : "heart-outline"}></ion-icon>
                    </button>
                    <div className="produitsBanners-content">
                        <p className="produitsBanners-subtitle">{item.subtitle}</p>
                        <h2 className="produitsBanners-title">{item.title}</h2>
                        <p className="produitsBanners-text">
                            À partir de <b>{item.price}€</b>
                        </p>
                        <button className="produitsBanners-btn" onClick={() => addToCart(item)}>Ajouter au panier</button>
                    </div>
                </div>
                ))}
            </div>
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
}  
export default ProduitsBanners;