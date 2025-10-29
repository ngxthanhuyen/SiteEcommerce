import React from 'react';
import './Feature.css';
import { featuresData } from '../../data/data';
import passionIcon from '../assets/images/passion.png';
import qualityIcon from '../assets/images/quality.png';
import natureIcon from '../assets/images/nature.png';
import integriteIcon from '../assets/images/poignee-de-main.png';
import innovationIcon from '../assets/images/pensez-a-lenvironnement.png';
import envIcon from '../assets/images/nature.png';
import transparenceIcon from '../assets/images/securite.png';
import backgroundImage from '../assets/images/bgr-img.png';

// On mappe les noms d’icônes avec les imports
const bgImg = {
  passionIcon,
  qualityIcon,
  natureIcon,
  integriteIcon,
  innovationIcon,
  envIcon,
  transparenceIcon,
};

const Feature = ({ type }) => {
  // On filtre selon le type
  const filteredData =
    type === 'accueil'
      ? featuresData.slice(0, 3) // les 3 premières
      : featuresData.slice(3);   // le reste pour 'about'

  return (
    <section className="feature">
      <h2 className="section-title">
        {type === 'accueil'
          ? 'Pourquoi choisir Unique Beauty ?'
          : 'Nos valeurs'}
      </h2>
      <div className={`flex-list ${type === 'about' ? 'about-grid' : ''}`}>
        {filteredData.map((feature, index) => (
          <div
            className="feature-content"
            style={{ backgroundImage: `url(${backgroundImage})` }}
            key={index}
          >
            <img
              src={bgImg[feature.icon]}
              alt={feature.title}
              width="100"
              height="100"
              className="card-icon"
            />
            <h3 className="card-title">{feature.title}</h3>
            <p className="card-text">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feature;
