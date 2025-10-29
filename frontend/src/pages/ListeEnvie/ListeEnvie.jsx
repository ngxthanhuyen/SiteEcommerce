import React, { useEffect, useState } from 'react';
import './ListeEnvie.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

export const ListeEnvie = () => {
    const [produits, setProduits] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchListeEnvie = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return navigate('/login');

                const response = await fetch('http://localhost:4000/api/liste-envie', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });
                if (!response.ok) throw new Error("Impossible de charger la liste d'envies");
                
                const data = await response.json();
                setProduits(data.produits || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchListeEnvie();
    }, [navigate]);

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

            setShowModal(true);
            setModalMessage("Ce produit est retiré de votre liste d'envies !");
            setTimeout(() => setShowModal(false), 2000);
            const data = await res.json();
            setProduits(data.produits || []);
            window.dispatchEvent(new CustomEvent('stateChange'));
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

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
                produitId: item.produitId,
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

    return (
        <>
        <div className="liste-envie-container">
        <h1 className='liste-envie-title'>Ma liste d'envies</h1>
        <div className="liste-envie-content">
            {produits.length === 0 ? (
            <p>Aucun produit enregistré pour l'instant.</p>
            ) : (
            <div className="grid-envie">
                {produits.map((p, i) => (
                <div key={i} className="envie-item">
                    {/* Ajout du conteneur d'image */}
                    <div className="envie-item-img-container">
                        <img src={p.img} alt={p.name} />
                        <button className="supprimer-btn" onClick={() => handleRemove(p.produitId)}>Supprimer</button>
                    </div>
                    <p className="envie-item-name">{p.name}</p>
                    <div className="price-cart">
                        <p className="envie-item-price">{p.price}€</p>
                        <button className="btn-bag"  onClick={() => addToCart(p)}>
                            <ion-icon name="bag-handle-outline"></ion-icon>
                        </button>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
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
    );
};

export default ListeEnvie;