/* eslint-disable no-unused-vars */
import React from "react";
import {
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiMessageSquare,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiUsers,
  FiCalendar,
  FiAward
} from "react-icons/fi";
import { motion } from "framer-motion";

// Footer Component
const Footer = () => {
  const socialLinks = [
    { name: "GitHub", icon: <FiGithub className="h-5 w-5" />, url: "#" },
    { name: "Twitter", icon: <FiTwitter className="h-5 w-5" />, url: "#" },
    { name: "LinkedIn", icon: <FiLinkedin className="h-5 w-5" />, url: "#" },
    { name: "Instagram", icon: <FiInstagram className="h-5 w-5" />, url: "#" },
    { name: "Discord", icon: <FiMessageSquare className="h-5 w-5" />, url: "#" }
  ];

  const quickLinks = [
    { name: "Home", url: "#" },
    { name: "About", url: "#" },
    { name: "Events", url: "#" },
    { name: "Team", url: "#" },
    { name: "Contact", url: "#" }
  ];

  const resources = [
    { name: "Learning Resources", url: "#" },
    { name: "Project Ideas", url: "#" },
    { name: "Code Repository", url: "#" },
    { name: "FAQs", url: "#" }
  ];

  return (
    <footer className="bg-gray-900/50 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 mb-12">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 mr-2"></div>
              <span className="text-xl font-bold text-white">AICC</span>
            </div>
            <p className="text-gray-300 mb-4">
              AI Coding Club is dedicated to empowering students with coding skills and fostering innovation in technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-300 hover:text-teal-400 transition-colors"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.url}
                    className="text-gray-300 hover:text-teal-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.url}
                    className="text-gray-300 hover:text-teal-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Stay updated with our latest events and news.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800/50 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-r-lg transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} AI Coding Club. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Code of Conduct</a>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center space-x-4">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="h-2 w-2 rounded-full bg-teal-400"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
              className="h-2 w-2 rounded-full bg-teal-400"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
              className="h-2 w-2 rounded-full bg-teal-400"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Export the Footer component
export default Footer;
