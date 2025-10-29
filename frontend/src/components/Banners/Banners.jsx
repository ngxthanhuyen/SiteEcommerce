import React from 'react'
import './Banners.css';
import lipstick from '../assets/images/lipstick.jpg';
import eyeshadow from '../assets/images/eyeshadow.jpg';
import foundation from '../assets/images/foundation.jpeg';

import { banniereData } from '../../data/data'; 

const bgImg = {
    lipstick, //lipstick : lipstick (imported from assets)
    eyeshadow,
    foundation
}
const Banners = () => {
  return (
    <>
    {/* Bannières défilantes */}
      <section className="banner">
        <div className="container">
          <ul className="scrollbar">
            {banniereData.map((item, index) => (
                <li className="scrollbar-item" key={index}>
                    <div className="bg-image" style={{backgroundImage : `url(${bgImg[item.bg]})`}}>
                        <div className="card-content">
                            <h1 className="h1-title">
                                {item.title}<br /><span>{item.span}</span>
                            </h1>
                            <p className="text">
                                {item.text}
                            </p>
                        </div>
                    </div>
                </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default Banners;
