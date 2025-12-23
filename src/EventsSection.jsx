/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Slide animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

// Hardcoded past events data
const pastEvents = [
  {
    title: "AI Chatbot Competition",
    date: "19 Sept 2025",
    time: "10:00 AM - 6:00 PM",
    location: "GHRCEM Pune",
    description:
      "24-hour hackathon where participants built AI chatbots to solve real-world problems.",
      images: [
        "../assets/events/chatbot1.png",
        "../assets/events/chatbot1.png",
        "../assets/events/chatbot1.png",
      ],
  },
  {
    title: "CodeVista 5.0",
    date: "25-28 Feb 2025",
    time: "9:00 AM - 5:00 PM",
    location: "GHRCEM Pune",
    description:
      "National-level coding event with online quizzes and offline coding rounds.",
      images: [
        "../assets/events/codevista1.png",
        "../assets/events/codevista2.png",
        "../assets/events/codevista3.png",
      ],
  },
];

const EventsSection = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [autoPlay, setAutoPlay] = useState(true);

  if (!pastEvents || pastEvents.length === 0) {
    return <div className="text-white text-center py-12">No events available</div>;
  }

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex([(currentIndex + 1) % pastEvents.length, 1]);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay]);

  const nextSlide = () => {
    setCurrentIndex([(currentIndex + 1) % pastEvents.length, 1]);
  };

  const prevSlide = () => {
    setCurrentIndex([(currentIndex - 1 + pastEvents.length) % pastEvents.length, -1]);
  };

  const goToSlide = (index) => {
    setCurrentIndex([index, index > currentIndex ? 1 : -1]);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-12 text-4xl md:text-5xl font-extrabold tracking-wide text-center"
        >
          <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">
            Our Flagship Events
          </span>
        </motion.h2>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-2xl shadow-2xl h-[500px]">
            <AnimatePresence custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="relative h-full"
              >
                <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden">
                  <img
                    src={pastEvents[currentIndex].images[0]}
                    alt={pastEvents[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent p-8 flex flex-col justify-end">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold mb-4 text-white"
                    >
                      {pastEvents[currentIndex].title}
                    </motion.h3>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-pink-400" />
                        <span>{pastEvents[currentIndex].date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-orange-400" />
                        <span>{pastEvents[currentIndex].time}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <FiMapPin className="text-purple-400" />
                        <span>{pastEvents[currentIndex].location}</span>
                      </div>
                    </div>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-300 mb-6 max-w-md"
                    >
                      {pastEvents[currentIndex].description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Navigation */}
          <div className="flex justify-between items-center mt-8 px-4">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-gray-800/50 text-white hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-gray-800/50 text-white hover:bg-gray-700 transition-colors"
            >
              <FiArrowRight className="text-xl" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {pastEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-pink-500 w-8" : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Auto-play toggle */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              {autoPlay ? "⏸ Pause" : "▶ Play"} Slideshow
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;