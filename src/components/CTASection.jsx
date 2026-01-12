/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCode, FiStar, FiUsers } from "react-icons/fi";
import { Link } from "react-router-dom";

// Floating animation for decorative elements
const floatVariants = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Gradient background animation
const gradientVariants = {
  animate: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 15,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

// Particle animation
const particleVariants = {
  initial: { opacity: 0, scale: 0 },
  animate: (i) => ({
    opacity: [0, 0.7, 0],
    scale: [0, 1, 0],
    transition: {
      duration: 3,
      delay: i * 0.2,
      repeat: Infinity,
      repeatType: "loop"
    }
  })
};

const CTASection = () => {
  // Create an array of particles for animation
  const particles = Array.from({ length: 12 });

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(270deg, #0b0e17, #1a1f2c, #24243e, #1a1f2c, #0b0e17)",
          backgroundSize: "400% 400%"
        }}
        variants={gradientVariants}
        animate="animate"
      />

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-16 bg-pink-500/20 rounded-2xl"
        variants={floatVariants}
        animate="float"
      />
      <motion.div
        className="absolute top-20 right-20 w-20 h-20 bg-orange-500/20 rounded-2xl"
        variants={floatVariants}
        animate="float"
      />
      <motion.div
        className="absolute bottom-20 left-24 w-12 h-12 bg-purple-500/20 rounded-2xl"
        variants={floatVariants}
        animate="float"
      />
      <motion.div
        className="absolute bottom-10 right-10 w-14 h-14 bg-indigo-500/20 rounded-2xl"
        variants={floatVariants}
        animate="float"
      />

      {/* Animated Particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="initial"
          animate="animate"
          variants={particleVariants}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${5 + Math.random() * 10}px`,
            height: `${5 + Math.random() * 10}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Animated Blob Background */}
      <motion.svg
        className="absolute -top-20 -left-20 w-96 h-96 opacity-10 text-pink-500/30 rotate-45 pointer-events-none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <path
          fill="currentColor"
          d="M40,-60C52,-50,60,-40,68,-28C76,-16,84,-2,80,12C76,26,60,40,46,50C32,60,20,68,6,68C-8,68,-16,60,-28,54C-40,48,-56,44,-60,34C-64,24,-56,8,-52,-8C-48,-24,-48,-40,-40,-52C-32,-64,-16,-72,0,-72C16,-72,32,-70,40,-60Z"
          transform="translate(100 100)"
        />
      </motion.svg>

      <motion.svg
        className="absolute -bottom-20 -right-20 w-72 h-72 opacity-10 text-orange-500/30 -rotate-45 pointer-events-none"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <path
          fill="currentColor"
          d="M40,-60C52,-50,60,-40,68,-28C76,-16,84,-2,80,12C76,26,60,40,46,50C32,60,20,68,6,68C-8,68,-16,60,-28,54C-40,48,-56,44,-60,34C-64,24,-56,8,-52,-8C-48,-24,-48,-40,-40,-52C-32,-64,-16,-72,0,-72C16,-72,32,-70,40,-60Z"
          transform="translate(100 100)"
        />
      </motion.svg>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-6 text-3xl font-bold md:text-4xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Ready to Start Your Coding Journey?
        </motion.h2>

        {/* Animated Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-10 max-w-2xl mx-auto text-lg text-gray-300"
        >
          Join AI Coding Club today and unlock a world of opportunities in technology, innovation, and collaboration.
        </motion.p>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-12 mb-12 flex-wrap"
        >
          {[
            { icon: <FiCode className="text-pink-400" />, label: "Code" },
            { icon: <FiUsers className="text-orange-400" />, label: "Collaborate" },
            { icon: <FiStar className="text-purple-400" />, label: "Innovate" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-2 border border-gray-700/30">
                {item.icon}
              </div>
              <span className="text-gray-300">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Animated CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
        >
          <Link to="/about">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(255, 105, 180, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-10 py-4 text-lg font-medium text-white shadow-lg transition-all mx-auto"
            >
              <span className="relative z-10">About Us</span>
              <motion.span
                className="relative z-10"
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FiArrowRight />
              </motion.span>
              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 opacity-0 group-hover:opacity-30 transition-opacity blur-md"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
