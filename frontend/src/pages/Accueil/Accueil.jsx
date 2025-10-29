import React from 'react';
import { Footer } from '../../components/Footer/Footer';
import videoBg from '../../components/assets/videos/logo.mp4';
import makeupBg from '../../components/assets/images/makeup.jpg';
import heartIcon from '../../components/assets/images/heart.png';
import './Accueil.css';
import Banner from '../../components/Banners/Banners';
import Catalogue from '../../components/Catalogue/Catalogue';
import Products from '../../components/Products/Products';
import Feature from '../../components/Feature/Feature';

const Accueil = () => {
  return (
    <>
      {/* Section Vidéo d'arrière-plan */}
      <video autoPlay loop muted playsInline className="back-video">
        <source src={videoBg} type="video/mp4" />
      </video>

      {/* Section Hero */}
      <section className="accueil">
        <img src={makeupBg} alt="Makeup Background" className="makeup-img" />
        <div className="accueil-content" >
          <h3>Votre beauté, notre passion</h3>
          <h1>Bienvenue à Unique Beauty</h1>
          <p className="accueil-text">
            "Plongez dans l'univers envoûtant de la beauté 
            avec<em> Unique Beauty</em>. Notre mission est de sublimer votre apparence, 
            de vous inspirer et de vous accompagner dans votre 
            voyage de confiance et d'expression personnelle. 
            Explorez notre gamme de produits innovants, conçus pour 
            révéler votre beauté intérieure et extérieure. Avec  
            <em> Unique Beauty</em>, chaque jour est une toile 
            sur laquelle vous pouvez peindre votre propre chef-d'œuvre de beauté."
          </p>
          <a href="#" className="accueil-btn">Découvrez votre nouvelle passion</a>
        </div>
      </section>

      <Banner />

      <Catalogue /> 

      <Products />

      {/* Section À propos */}
      <section className="about">
        <h1 className="heading"  style={{ backgroundImage: `url(${heartIcon})` }}>À propos de nous</h1>
        <div className="line">
          <div className="img-container">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Notre équipe" 
              style={{ width: '660px', height: '500px' }}
            />
            <h3>The Perfect Team</h3>
          </div>

          <div className="content">
            <h3 className='content-title'>Quelques Mots Sur Nous</h3>
            <p>
                Notre équipe est composée de professionnels dévoués, expérimentés
                qui partagent tous la même passion pour le maquillage, la beauté
                et la créativité. Chaque membre de notre équipe apporte une expertise 
                unique dans son domaine, ce qui nous permet de collaborer de manière 
                transparente et d'atteindre des résultats exceptionnels. 
                Notre engagement envers nos clients et notre passion pour notre travail sont 
                les moteurs qui nous poussent à repousser constamment les limites. 
                Nous sommes fiers de faire partie de cette communauté passionnée et de contribuer à révéler 
                la confiance et l'éclat intérieur de chacun de nos clients.
            </p>
            <a href="/aboutus" className="accueil-btn2">En savoir plus</a>
          </div>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <Feature type="accueil" />
      <Footer />
    </>
  );
};

export default Accueil;