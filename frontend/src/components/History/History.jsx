import React from 'react'
import './History.css';
import { historyData } from '../../data/data';

const History = () => {
  return (
    <section className="histoire">
      <h2 className="histoire-title">Notre histoire</h2>
      <div className="history-grid">
        {historyData.map((item, index) => (
          <div className="history-card" key={index}>
            <h3 className="history-card-title">{item.title}</h3>
            <p className="history-card-text">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="timeline-bar">
        {historyData.map((item, index) => (
          <div className="timeline-year" key={index}>
            {item.year}
          </div>
        ))}
      </div>
    </section>
  );
}
export default History;
