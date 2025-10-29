import React, { useEffect, useState } from 'react';
import './Header.css';
import { NavLink } from 'react-router-dom';
import heartIcon from '../assets/images/heart.png';

export const Header = () => {
    const [userName, setUserName] = useState(localStorage.getItem('userName'));
    const [panier, setPanier] = useState({ total: 0, count: 0 });
    const [wishlistCount, setWishlistCount] = useState(0); 

    // Fonction pour vérifier l'état actuel
    const checkState = async () => {
        const token = localStorage.getItem('token');
        const currentUser = localStorage.getItem('userName');
        setUserName(currentUser);

        if (!token || !currentUser) {
            setPanier({ total: "0.00", count: 0 });
            setWishlistCount(0); 
            return;
        }

        try {
            // Récupérer le panier
            const panierResponse = await fetch('http://localhost:4000/api/panier/', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
            });
            
            if (!panierResponse.ok) throw new Error('Erreur serveur panier');
            
            const panierData = await panierResponse.json();
            const produitsPanier = panierData.produits || [];

            // Calcul des valeurs du panier
            const total = produitsPanier.reduce((sum, item) => {
                return sum + (Number(item.price) || 0) * (Number(item.quantite) || 0);
            }, 0);

            const count = produitsPanier.reduce((sum, item) => {
                return sum + (Number(item.quantite) || 0);
            }, 0);

            setPanier({
                total: total.toFixed(2),
                count
            });

            // Récupérer la liste d'envies
            const wishlistResponse = await fetch('http://localhost:4000/api/liste-envie', {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store'
            });

            if (wishlistResponse.ok) {
                const wishlistData = await wishlistResponse.json();
                const produitsWishlist = wishlistData.produits || [];
                setWishlistCount(produitsWishlist.length); 
            }

        } catch (error) {
            console.error("Erreur chargement état", error);
            setPanier({ total: "0.00", count: 0 });
            setWishlistCount(0);
        }
    };

    // Écouter les changements
    useEffect(() => {
        // Vérifier immédiatement
        checkState();
        
        window.addEventListener('stateChange', checkState);
        window.addEventListener('storage', checkState);
        
        return () => {
            window.removeEventListener('stateChange', checkState);
            window.removeEventListener('storage', checkState);
        };
    }, []);

    return (
        <header className="header">
            <div className="alert">
                <div className="container">
                    <p className="alert-text">
                        <span className="highlight">-25%</span> dès <span className="highlight">50€</span> d'achats sur une sélection maquillage, soin et parfum !
                    </p>
                </div>
            </div>

            <div className="header-top">
                <div className="container">
                    <div className="input-wrapper">
                        <input
                            type="search"
                            name="search"
                            placeholder="Chercher votre produit..."
                            className="search-field"
                        />
                        <button className="search-submit" aria-label="search">
                            <ion-icon name="search-outline" aria-hidden="true"></ion-icon>
                        </button>
                    </div>

                    <span className="logo">
                        <img src={heartIcon} alt="heart icon"/>
                        <span>Unique Beauty</span>
                    </span>

                    <div className="header-actions">
                        <NavLink to={userName ? "/profil" : "/login"} className="header-action-btn" aria-label="user">
                            <ion-icon name="person-outline" aria-hidden="true"></ion-icon>
                            <p className="header-action-label">{userName ? userName : "S'inscrire"}</p>
                        </NavLink>
                        
                        <NavLink to="/liste-envie" className="header-action-btn" aria-label="favourite item">
                            <ion-icon name="heart-outline" width="60px" height="40px"></ion-icon>
                            <span className="btn-badge">{wishlistCount}</span> {/* ← AFFICHAGE DU NOMBRE */}
                            <p className="header-action-label">Liste d'envies</p>
                        </NavLink>

                        <NavLink to="/panier" className="header-action-btn" aria-label="cart item">
                            <data className="btn-text">€{panier.total}</data>
                            <ion-icon name="bag-handle-outline"></ion-icon>
                            <span className="btn-badge">{panier.count}</span>
                        </NavLink>
                    </div>

                    {/* Barre De Navigation */}
                    <nav className="navbar">
                        <ul className="navbar-list">
                            <li>
                                <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Accueil</NavLink>
                            </li>
                            <li>
                                <NavLink to="/aboutus" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>About us</NavLink>
                            </li>
                            <li>
                                <NavLink to="/produits" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>Nos produits</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;