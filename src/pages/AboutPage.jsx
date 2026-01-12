/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiStar,
  FiCode,
  FiAward,
  FiBook,
  FiTarget,
} from "react-icons/fi";

// Team member card component
const TeamMemberCard = ({ name, role, description, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg p-6 sm:p-6 text-center"
    >
      <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-3xl sm:text-4xl text-white">
            {name.charAt(0)}
          </span>
        )}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
        {name}
      </h3>
      <p className="text-pink-400 mb-2 text-sm sm:text-base">{role}</p>
      <p className="text-gray-300 text-sm leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

// About Page
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 sm:pt-24 pb-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center py-10 sm:py-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          About AI Coding Club
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 leading-relaxed px-2 sm:px-0"
        >
          We are a community of passionate coders, innovators, and AI
          enthusiasts dedicated to fostering creativity, collaboration,
          and cutting-edge technology.
        </motion.p>
      </section>

      {/* Mission and Vision */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 my-12 sm:my-16 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <div className="flex items-center mb-4">
            <FiTarget className="text-pink-400 text-3xl mr-4" />
            <h2 className="text-xl sm:text-2xl font-bold">
              Our Mission
            </h2>
          </div>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            To empower students with the skills and knowledge to excel in
            AI, machine learning, and software development through
            hands-on projects, workshops, and mentorship.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <div className="flex items-center mb-4">
            <FiStar className="text-pink-400 text-3xl mr-4" />
            <h2 className="text-xl sm:text-2xl font-bold">
              Our Vision
            </h2>
          </div>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            To become a leading hub for innovation and excellence in AI
            and technology, nurturing the next generation of tech
            leaders and entrepreneurs.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto my-12 sm:my-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          Meet Our Faculty Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <TeamMemberCard
            name="Dr. Rachna Sable"
            role="HOD, AI & AIML Department"
            description="Leading the AI & AIML department with a vision to integrate cutting-edge technology into education."
          />
          <TeamMemberCard
            name="Vaishali Baviskar"
            role="Faculty Co-ordinator"
            description="Passionate about mentoring students and driving innovation in AI and machine learning."
          />
          <TeamMemberCard
            name="Komal Jadhav"
            role="Faculty Co-ordinator"
            description="Dedicated to fostering a collaborative and creative environment for students."
          />
        </div>
      </section>

      {/* Club Features */}
      <section className="max-w-6xl mx-auto my-12 sm:my-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12 bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
        >
          What We Offer
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: <FiCode className="text-pink-400 text-3xl" />,
              title: "Coding Workshops",
              description:
                "Hands-on workshops to enhance your coding and AI skills.",
            },
            {
              icon: <FiUsers className="text-pink-400 text-3xl" />,
              title: "Collaborative Projects",
              description:
                "Work on real-world projects with peers and mentors.",
            },
            {
              icon: <FiAward className="text-pink-400 text-3xl" />,
              title: "Hackathons",
              description:
                "Participate in hackathons and compete with the best.",
            },
            {
              icon: <FiBook className="text-pink-400 text-3xl" />,
              title: "Learning Resources",
              description:
                "Access to curated resources and study materials.",
            },
            {
              icon: <FiStar className="text-pink-400 text-3xl" />,
              title: "Innovation Labs",
              description:
                "Experiment with new ideas and technologies.",
            },
            {
              icon: <FiTarget className="text-pink-400 text-3xl" />,
              title: "Career Guidance",
              description:
                "Get mentorship and guidance for your career in tech.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-800 p-6 sm:p-6 rounded-xl shadow-lg text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
