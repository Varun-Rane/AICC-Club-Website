/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiMapPin,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import code from "../assets/code.jpg";
import python from "../assets/python.jpg";
import vista from "../assets/vista.jpg";

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

// Sample event data
const events = [
  {
    id: 1,
    title: "National Level Competition – CodeVista 5.0",
    date: "25th & 28th February 2025",
    location: "G H Raisoni College Of Engineering, Wagholi, Pune",
    image: vista,
  },
  {
    id: 2,
    title: "Python Workshop",
    date: "29th & 30th August 2024",
    location: "E-108, G H Raisoni College of Engineering",
    image: python,
  },
  {
    id: 3,
    title: "C Code Craft: C Challenge Competition",
    date: "27th July 2024",
    location: "G H Raisoni College Of Engineering & Management",
    image: code,
  },
];

const EventsSection = () => {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);
  const [autoPlay, setAutoPlay] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // modal state

  // Auto-advance slides
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex([(currentIndex + 1) % events.length, 1]);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, autoPlay]);

  const nextSlide = () => {
    setCurrentIndex([(currentIndex + 1) % events.length, 1]);
  };

  const prevSlide = () => {
    setCurrentIndex([(currentIndex - 1 + events.length) % events.length, -1]);
  };

  const goToSlide = (index) => {
    setCurrentIndex([index, index > currentIndex ? 1 : -1]);
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gray-900 text-white">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(270deg, #0b0e17, #1a1f2c, #24243e, #1a1f2c, #0b0e17)",
          backgroundSize: "400% 400%",
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-12 text-4xl md:text-5xl font-extrabold tracking-wide text-center"
        >
          <span className="bg-gradient-to-r from-pink-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">
            Our Recent Events
          </span>
        </motion.h2>

        {/* Slideshow Container */}
        <div className="relative max-w-5xl mx-auto">
          {/* Slide Container */}
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
                {/* Current Slide */}
                <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden">
                  <img
                    src={events[currentIndex].image}
                    alt={events[currentIndex].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent p-8 flex flex-col justify-end">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold mb-4 text-white"
                    >
                      {events[currentIndex].title}
                    </motion.h3>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-gray-300">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-pink-400" />
                        <span>{events[currentIndex].date}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <FiMapPin className="text-purple-400" />
                        <span>{events[currentIndex].location}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEvent(events[currentIndex])}
                      className="px-6 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white w-fit"
                    >
                      View Details
                    </motion.button>
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
            {events.map((_, index) => (
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

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              >
                ✖
              </button>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{selectedEvent.date}</p>

              {/* Full Info based on ID */}
              {selectedEvent.id === 1 && (
                <>
                  <p className="mb-4">
                    The Department of AI & AIML, in association with the AI & Coding
                    Club (AICC) and Society for Data Science (S4DS), organized CodeVista
                    5.0, a national-level coding competition with two rounds – an online
                    technical quiz and an offline coding round.
                  </p>
                  <p className="mb-4">
                    The event saw <b>674 registrations</b>, including participants from
                    reputed institutes such as AIT, VIIT, PICT, IIT Madras, and IIT
                    Patna. From these, <b>100 finalists</b> competed in the offline round
                    at GHRCEM, Pune. A panel discussion by industry experts further
                    enriched the event.
                  </p>
                  <h4 className="font-semibold text-lg mb-2">
                    🏆 Winners & Cash Prizes:
                  </h4>
                  <ul className="list-disc list-inside mb-4">
                    <li>Rishi Kumar Singh – 1st Prize</li>
                    <li>Roshan Gupta – 2nd Prize</li>
                    <li>Sumit Choudhary – 3rd Prize</li>
                  </ul>
                  <p>
                    CodeVista 5.0 successfully provided a platform for young coders to
                    showcase their skills while fostering innovation and
                    entrepreneurship.
                  </p>
                </>
              )}

              {selectedEvent.id === 2 && (
                <>
                  <p className="mb-4">
                    The Department of AI & AIML, in association with the AI & Coding
                    Club (AICC), organized a two-day{" "}
                    <b>Python Workshop on 29th & 30th August 2024</b>.
                  </p>
                  <p className="mb-4">
                    This hands-on workshop provided a practical platform for aspiring
                    programmers to dive into the world of Python. Participants explored
                    everything from <b>fundamentals</b> to <b>building functional
                    projects</b>, guided by expert mentors.
                  </p>
                  <p>
                    The event witnessed enthusiastic participation, with students gaining
                    <b> real-world coding experience</b> and improving their confidence in
                    problem-solving using Python.
                  </p>
                </>
              )}

              {selectedEvent.id === 3 && (
                <>
                  <p className="mb-4">
                    The Department of AI & AIML, in association with the AI & Coding
                    Club (AICC), organized the{" "}
                    <b>C Code Craft: C Challenge Competition</b> on{" "}
                    <b>27th July 2024</b>.
                  </p>
                  <p className="mb-4">The competition was conducted in two rounds:</p>
                  <ul className="list-disc list-inside mb-4">
                    <li>✅ Round 1: Quiz on C programming fundamentals</li>
                    <li>✅ Round 2: Coding challenge based on problem statements</li>
                  </ul>
                  <p>
                    The event witnessed participation from <b>100+ students</b>, who
                    showcased excellent coding and problem-solving abilities. Winners
                    were awarded prizes & certificates, while all participants gained
                    <b> valuable hands-on experience</b> in C programming.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
