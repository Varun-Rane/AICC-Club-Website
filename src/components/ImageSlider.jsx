/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      title: "Tech Talk: Web3",
      description: "Exploring the future of decentralized technologies with guest speakers from top blockchain companies.",
      imageUrl: "https://via.placeholder.com/1200x600/FF5722/FFFFFF?text=Web3+Tech+Talk",
    },
    {
      title: "Hackathon 2025",
      description: "Our annual 48-hour hackathon brought together 200+ participants to innovate and build amazing projects.",
      imageUrl: "https://via.placeholder.com/1200x600/FF5722/FFFFFF?text=Hackathon+2025",
    },
    {
      title: "Workshop: AI & ML",
      description: "A hands-on workshop covering the latest in AI and Machine Learning, led by industry experts.",
      imageUrl: "https://via.placeholder.com/1200x600/FF5722/FFFFFF?text=AI+Workshop",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Slider Container */}
      <div className="relative overflow-hidden rounded-2xl h-72 md:h-96 w-full bg-gray-100/20 border-2 border-orange-400/40 backdrop-blur-lg shadow-lg">
        <AnimatePresence initial={false}>
          {slides.map((slide, index) =>
            currentIndex === index ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                  <motion.img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Overlay */}
                  <div className="absolute left-4 right-4 bottom-4 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-lg text-white">
                    <motion.h3
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="font-bold text-xl md:text-2xl"
                    >
                      {slide.title}
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-sm md:text-base mt-2"
                    >
                      {slide.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="w-3 h-3 rounded-full"
            animate={{ scale: currentIndex === index ? 1.3 : 1, opacity: currentIndex === index ? 1 : 0.5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              backgroundColor: currentIndex === index ? "#F97316" : "#A1A1AA",
            }}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(251,146,60,0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all text-lg font-medium shadow-lg"
        >
          View All Events
          <FiArrowRight className="ml-1" />
        </motion.button>
      </div>
    </div>
  );
};

export default ImageSlider;
