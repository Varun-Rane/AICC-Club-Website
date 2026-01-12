import React, { useEffect, useRef } from 'react';
import "../styles/PolygonBackground.css";

const PolygonBackground = () => {
  const polygonRefs = useRef([]);

  useEffect(() => {
    const polygons = polygonRefs.current;

    // Randomly position and style polygons
    polygons.forEach((polygon) => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const hue = Math.floor(Math.random() * 360);
      const size = 50 + Math.random() * 100;

      polygon.style.left = `${x}px`;
      polygon.style.top = `${y}px`;
      polygon.style.backgroundColor = `hsla(${hue}, 100%, 50%, 0.3)`;
      polygon.style.width = `${size}px`;
      polygon.style.height = `${size}px`;
    });

    // Animate polygons every 3 seconds
    const animatePolygons = () => {
      polygons.forEach((polygon) => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        polygon.style.left = `${x}px`;
        polygon.style.top = `${y}px`;
      });
    };

    const interval = setInterval(animatePolygons, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="polygon-background">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          ref={(el) => (polygonRefs.current[index] = el)}
          className="polygon"
        />
      ))}
    </div>
  );
};

export default PolygonBackground;
