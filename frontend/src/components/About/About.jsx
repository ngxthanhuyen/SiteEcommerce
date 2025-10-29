import React from 'react'
import './About.css';
import { aboutData } from '../../data/data';

const About = () => {
  return (
     <section className="about-sections">
      {aboutData.map((item, index) => (
        <div
          key={index}
          className={`about-card ${item.reverse ? "reverse" : ""}`}
        >
          <div className="image-container">
            <img src={item.img} alt={item.title} />
          </div>
          <div className="about-content">
            <h2 className="about-title">{item.title}</h2>
            <p className="about-text">{item.text}</p>
          </div>
          
        </div>
      ))}
    </section>
  )
}
export default About;