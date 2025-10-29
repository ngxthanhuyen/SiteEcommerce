import React from 'react'
import './AboutUs.css'
import { Footer } from '../../components/Footer/Footer';
import makeupBg from '../../components/assets/images/makeup_background.jpg';
import History from '../../components/History/History';
import About from '../../components/About/About';
import Feature from '../../components/Feature/Feature';
const AboutUs = () => {
  return (
    <>
        <section className="aboutBanner" style={{backgroundImage: `url(${makeupBg})`}}>
            <div className="content">
                <h3>About Us</h3>
                <h1>À propos de nous</h1>
                <p className="banner-text">
                    Notre équipe est composée de professionnels dévoués, expérimentés qui partagent tous la même passion pour le maquillage, la beauté et la créativité. Chaque membre de notre équipe apporte une expertise unique dans son domaine, ce qui nous permet de collaborer de manière transparente et d'atteindre des résultats exceptionnels. Notre engagement envers nos clients et notre passion pour notre travail sont les moteurs qui nous poussent à repousser constamment les limites. Nous sommes fiers de faire partie de cette communauté passionnée et de contribuer à révéler la confiance et l'éclat intérieur de chacun de nos clients.                
                </p>
            </div>
        </section>
        <div className="wrapper-fondateur">
            <h1>Notre fondatrice</h1>
            <div className="team">
                <div className="team_member">
                <img
                    className="team_img"
                    src="https://i.pinimg.com/564x/9f/b1/8b/9fb18bb36c8cd2ef321c491d81d5c81c.jpg"
                    alt="Team_image"
                />
                <h3>NGUYEN Thanh Uyen</h3>
                <p className="role">Fondatrice</p>
                <p className="details">
                    La fondatrice de notre marque de maquillage est une jeune entrepreneure
                    animée par une passion inébranlable pour la créativité et l'expression
                    artistique. Son amour pour l'art du maquillage a commencé dès son
                    adolescence, et elle a toujours rêvé de créer une ligne de produits qui
                    permettrait à chacun de s'exprimer à travers la beauté. En tant que
                    créatif en chef, sa responsabilité principale est de superviser le
                    développement de produits innovants, de travailler en étroite
                    collaboration avec les équipes de conception pour créer des emballages
                    inspirants, et de s'assurer que chaque produit incarne la vision
                    artistique de la marque.
                </p>
                </div>
            </div>
        </div>
        <History />
        <About/>
        <Feature type="about" />
        <Footer />
    </>
  )
}
export default AboutUs;