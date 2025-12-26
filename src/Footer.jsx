/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-16 pb-8"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-full px-8 py-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Left */}
          <p className="text-xs text-gray-400">
            © 2025{" "}
            <span className="font-semibold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              AI & Coding Club
            </span>
            . All rights reserved.
          </p>

          {/* Center */}
          <div className="flex gap-4 text-xs text-gray-400">
            <Link to="/about" className="hover:text-white transition">
              About
            </Link>
            <Link to="/events" className="hover:text-white transition">
              Events
            </Link>
            <Link to="/teams" className="hover:text-white transition">
              Team
            </Link>
          </div>

          {/* Right */}
          <p className="text-xs text-gray-500">
            Built with ❤️ by{" "}
            <span className="text-gray-300 font-medium">
              AICC Tech Team
            </span>
          </p>

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
