  /* eslint-disable no-unused-vars */
  import React, { useEffect, useState } from "react";
  import { motion } from "framer-motion";
  import { Link } from "react-router-dom";
  import club from "../assets/aicc-logo-white.png";
  import college from "../assets/raisoni.png";
  import DotGrid from "./DotGrid";

  // Marquee Component
  const Marquee = ({ items, direction = "left", speed = 20 }) => {
    return (
      <div className="relative w-full overflow-hidden bg-gray-800/50 py-4 border-t border-gray-700/50">
        <motion.div
          className="flex whitespace-nowrap gap-12"
          animate={{
            x: direction === "left" ? "-100%" : "100%",
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.concat(items).map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-4 text-white text-lg font-medium"
            >
              {item.icon && <span className="text-pink-400">{item.icon}</span>}
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  const HeroSection = () => {
    const [polygons, setPolygons] = useState([]);

    useEffect(() => {
      const newPolygons = Array.from({ length: 10 }, (_, index) => ({
        id: index,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 30 + Math.random() * 50,
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
        speedX: 0.5 + Math.random() * 1,
        speedY: 0.5 + Math.random() * 1,
      }));
      setPolygons(newPolygons);
    }, []);

    useEffect(() => {
      const animatePolygons = () => {
        setPolygons((prevPolygons) =>
          prevPolygons.map((polygon) => {
            let newX = polygon.x + polygon.speedX;
            let newY = polygon.y + polygon.speedY;
            if (newX <= 0 || newX >= window.innerWidth) polygon.speedX *= -1;
            if (newY <= 0 || newY >= window.innerHeight) polygon.speedY *= -1;
            newX = Math.max(0, Math.min(newX, window.innerWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight));
            return { ...polygon, x: newX, y: newY };
          })
        );
        requestAnimationFrame(animatePolygons);
      };
      animatePolygons();
    }, []);

    const marqueeItems = [
      { text: "🚀 Join our AI workshops" },
      { text: "💻 Learn cutting-edge technologies" },
      { text: "🤖 Build AI projects" },
      { text: "🏆 Participate in hackathons" },
      { text: "🌟 Grow with our community" },
      { text: "🎓 Get mentorship from experts" },
      { text: "💡 Innovate with AI solutions" },
    ];

    return (
      <div className="relative min-h-screen w-full bg-gray-900 text-white overflow-hidden">
        {/* 🔹 FIX: Full-screen dot background */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        >
          <DotGrid
            dotSize={4}
            gap={18}
            baseColor="rgba(255, 255, 255, 0.2)"   // dim white
            activeColor="rgba(255, 255, 255, 1)"   // bright white on hover
            proximity={50}
            shockRadius={200}
            shockStrength={4}
            resistance={700}
            returnDuration={0}
          />
        </div>

        {/* 🔹 Polygon Background */}
        {polygons.map((polygon) => (
          <motion.div
            key={polygon.id}
            className="absolute rounded-sm cursor-pointer"
            style={{
              width: `${polygon.size}px`,
              height: `${polygon.size}px`,
              backgroundColor: polygon.color,
              left: `${polygon.x}px`,
              top: `${polygon.y}px`,
              transform: "rotate(45deg)",
              opacity: 0.4,
              zIndex: 1,
            }}
            whileHover={{
              scale: 1.2,
              opacity: 0.9,
              transition: { duration: 0.3 },
            }}
          />
        ))}

        {/* 🔹 Main Content aligned center */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center min-h-screen px-6">
          {/* Left */}
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Empower Your</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500">
                Coding Journey
              </span>
              <br />
              <span className="text-white">with AICC</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto md:mx-0">
              Create, Code, Conquer: Build the future with AI Coding Club.
            </p>
            <Link to="/events">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(255, 255, 255, 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              >
                View Upcoming Events →
              </motion.button>
            </Link>
          </div>

          {/* Right */}
          <div className="md:w-1/2 flex flex-col items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4 w-full max-w-sm cursor-pointer border border-gray-700"
            >
              <img src={club} alt="Club Logo" className="h-12 w-12 rounded-full" />
              <div className="text-left">
                <h3 className="text-xl font-bold">AI Coding Club</h3>
                <p className="text-gray-400">Innovate. Build. Conquer.</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4 w-full max-w-sm cursor-pointer border border-gray-700"
            >
              <img src={college} alt="College Logo" className="h-12 w-12 rounded-full" />
              <div className="text-left">
                <h3 className="text-xl font-bold">Your College Name</h3>
                <p className="text-gray-400">Excellence in Education</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Marquee */}
        <Marquee items={marqueeItems} speed={30} />
      </div>
    );
  };

  export default HeroSection;
