import video1 from '../assets/videos/video1.mp4';
import video2 from '../assets/videos/video2.mp4';
import video3 from '../assets/videos/video3.mp4';
import './SkincareBestSeller.css';

const SkincareBestseller = () => {
  const videos = [video1, video2, video3];

  return (
    <section className="skincare" style={{ textAlign: 'center' }}>
      <h2>Nos Skin Care Bestseller</h2>
      {videos.map((src, i) => (
        <video
          key={i}
          autoPlay
          loop
          muted
          playsInline
          className='backVideo'
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </section>
  );
};

export default SkincareBestseller;
