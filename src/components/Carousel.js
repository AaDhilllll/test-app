'use client';

import { useEffect, useRef } from 'react';

export default function Carousel() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollInterval = setInterval(() => {
      track.scrollLeft += 1;
      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(scrollInterval);
  }, []);

  const posters = [
    "/interstellar.jpg",
    "/sinners.jpg",
    "/lalaland.png",
    "/The_Godfather.jpg",
  ];

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <div className="carousel-track" ref={trackRef}>
          {posters.concat(posters).map((src, index) => (
            <img key={index} src={src} alt={`Poster ${index + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
