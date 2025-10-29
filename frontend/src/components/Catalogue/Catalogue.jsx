import React from 'react'
import './Catalogue.css';
import catalogue1 from '../assets/images/catalogue1.jpeg';
import catalogue2 from '../assets/images/catalogue2.jpeg';
import catalogue3 from '../assets/images/catalogue3.jpeg';
import { catalogueData } from '../../data/data';    

const bgImg = {
    catalogue1,
    catalogue2,
    catalogue3
}
const Catalogue = () => {
  return (
    <>
        <section className="catalogue">
            <ul className="catalogue-list">
                {catalogueData.map((item, index) => (
                    <li key={index}>
                        <div className="catalogue-card has-before hover:shine" >
                            <h2 className="h2 card-title"> {item.title}</h2>
                            <p className="card-text">{item.subtitle}</p>
                            <div className="bg-photo" style={{backgroundImage: `url(${bgImg[item.image]})`}}></div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    </>
  )
}

export default Catalogue;
