import React from 'react';
import './Footer.css';
import heartIcon from '../assets/images/heart.png';
import payImage from '../assets/images/pay.png';
import freeDelivery from '../assets/images/free-delivery.png';
import returnIcon from '../assets/images/return.png';
import designImage from '../assets/images/design.png';
import securePayment from '../assets/images/secure-payment.png';
import customerService from '../assets/images/customer-service.png';

export const Footer = () => {
  return (
    <>
        <section className="service reveal">
            <div className="container">
                <ul className="service-list">
                    <li className="service-item">
                        <div className="service-item-icon">
                            <img src={freeDelivery} alt="free-delivery"/>
                        </div>

                        <div className="service-content">
                            <p className="service-item-title">Livraison Gratuite</p>
                            <p className="service-item-text"> Pour toute commande supérieure à 50€</p>
                        </div>
                    </li>

                    <li className="service-item">
                        <div className="service-item-icon">
                            <img src={returnIcon} alt="Service icon"/>
                        </div>

                        <div className="service-content">
                        <p className="service-item-title">Retours Faciles</p>
                        <p className="service-item-text">Politique de retours de 30 jours</p>
                        </div>
                    </li>

                    <li className="service-item">
                        <div className="service-item-icon">
                            <img src={securePayment} alt="Service icon"/>
                        </div>

                        <div className="service-content">
                            <p className="service-item-title">Paiement Sécurisée</p>

                            <p className="service-item-text">Garantie de sécurite À 100%</p>
                        </div>
                    </li>

                    <li className="service-item">
                        <div className="service-item-icon">
                            <img src={customerService} alt="Service icon"/>
                        </div>

                        <div className="service-content">
                            <p className="service-item-title">Service Client </p>
                            <p className="service-item-text">Assitance 24/7</p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
        <section>
            <img className="bg-image4" src={designImage}></img>
        </section>
        <footer className="footer">
            <div className="container">
                <div className="footer-brand">
                    <span className="logo2">Unique Beauty</span>
                    <p className="footer-text">
                        "Rejoignez-nous pour une expérience de beauté unique. Laissez-nous vous guider vers une beauté unique et inoubliable. Nous attendons avec impatience de vous accueillir chez Unique Beauty."
                    </p>
                    <ul className="social-list">
                        <li><a href="#" className="social-link"><span className='logo-facebook'><ion-icon name="logo-facebook"></ion-icon></span></a></li>
                        <li><a href="#" className="social-link"><ion-icon name="logo-twitter"></ion-icon></a></li>
                        <li><a href="#" className="social-link"><ion-icon name="logo-instagram"></ion-icon></a></li>
                        <li><a href="#" className="social-link"><ion-icon name="logo-tiktok"></ion-icon></a></li>
                    </ul>
                    </div>

                    <ul className="footer-list">
                        <li><p className="footer-list-title">Informations</p></li>
                        <li><a href="#" className="footer-link">About Us</a></li>
                        <li><a href="#" className="footer-link">Nos Produits</a></li>
                        <li><a href="#" className="footer-link">Tendances</a></li>
                        <li><a href="#" className="footer-link">Paiement Sécurisée</a></li>
                        <li><a href="#" className="footer-link">Termes & Conditions</a></li>
                    </ul>

                    <ul className="footer-list">
                        <li><p className="footer-list-title">Aide & Support</p></li>
                        <li><a href="#" className="footer-link">FAQ Information</a></li>
                        <li><a href="#" className="footer-link">Expédition & Livraison</a></li>
                        <li><a href="#" className="footer-link">Politique de Retour</a></li>
                        <li><a href="#" className="footer-link">Forum</a></li>
                        <li><a href="#" className="footer-link">Assistance</a></li>
                    </ul>

                    <ul className="footer-list">
                    <li><p className="footer-list-title">Contact</p></li>
                    <li className="footer-nav-item flex">
                        <div className="icon-box">
                        <ion-icon name="location-outline"></ion-icon>
                        </div>
                        <a href="#" className="address">
                        1411 3th St, Broadway, New York(NY), 14812, USA
                        </a>
                    </li>

                    <li className="footer-nav-item flex">
                        <div className="icon-box">
                        <ion-icon name="call-outline"></ion-icon>
                        </div>
                        <a href="#" className="phone-number">+1 212-387-6489</a>
                    </li>

                    <li className="footer-nav-item flex">
                        <div className="icon-box">
                        <ion-icon name="mail-outline"></ion-icon>
                        </div>
                        <a href="#" className="email">uniquebeauty.official@gmail.com</a>
                    </li>

                    <li className="footer-nav-item flex">
                        <p className="footer-list-title2">
                        Semaine: 08:00 - 20:00<br />
                        Weekend: 10:00 - 18:00
                        </p>
                    </li>
                    </ul>
                </div>

                <div className="footer-bottom">
                    <div className="wrapper">
                        <p className="copyright">
                            Copyright &copy; Unique Beauty All Rights Reserved
                        </p>
                        <span className="logoWithIcon">
                            <img className="heartIcon" src={heartIcon} alt="heart icon" />
                            <span className="logo3">Unique Beauty</span>
                        </span>
                        <img src={payImage} width="313" height="28" alt="Méthodes de paiement" className="w-100" />
                    </div>
                </div>
        </footer>
    </>
  );
};
export default Footer;