/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { FiCode, FiUsers, FiCalendar, FiAward } from "react-icons/fi";

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      type: "spring",
      stiffness: 100,
      damping: 10
    },
  }),
  hover: {
    scale: 1.05,
    rotate: 1,
    boxShadow: "0 10px 25px rgba(255, 105, 180, 0.3)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  }
};

// Floating animation for decorative elements
const floatVariants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
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
      duration: 10,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

const FeaturesSection = () => {
  return (
    <section className="relative py-20 px-6 bg-gray-900 text-white overflow-hidden">
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

      {/* Decorative Floating Elements */}
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

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-14 text-4xl md:text-5xl font-extrabold tracking-wide"
        >
          <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-purple-500 bg-clip-text text-transparent">
            Why Join AICC?
          </span>
        </motion.h2>

        {/* Animated Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-16 text-lg text-gray-300 max-w-2xl mx-auto"
        >
          Discover the benefits of joining our coding community and take your skills to the next level.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <FiCode className="h-8 w-8 text-purple-400" />,
              title: "Hands-on Coding",
              description:
                "Work on real-world projects and improve your coding skills with practical experience.",
              delay: 0.1,
            },
            {
              icon: <FiUsers className="h-8 w-8 text-pink-400" />,
              title: "Community",
              description:
                "Join a network of like-minded coders, mentors, and industry professionals.",
              delay: 0.2,
            },
            {
              icon: <FiCalendar className="h-8 w-8 text-indigo-400" />,
              title: "Events",
              description:
                "Participate in hackathons, workshops, and tech talks throughout the year.",
              delay: 0.3,
            },
            {
              icon: <FiAward className="h-8 w-8 text-orange-400" />,
              title: "Recognition",
              description:
                "Get recognized for your skills and achievements in the tech community.",
              delay: 0.4,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              custom={feature.delay}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover="hover"
              className="p-8 rounded-2xl bg-gray-800/50 border border-gray-700/40 shadow-lg backdrop-blur-md"
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg mx-auto"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: feature.delay + 0.2 }}
                className="mb-4 text-xl font-bold text-white"
              >
                {feature.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: feature.delay + 0.3 }}
                className="text-gray-300 text-sm"
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Animated CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
          className="mt-16"
        >
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
