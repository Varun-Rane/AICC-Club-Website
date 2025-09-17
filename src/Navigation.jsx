/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import club from "../assets/aicc-logo-white.png";

const Navigation = ({ user, isAdmin, onLogout }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 10 }}
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div className="bg-gray-800/90 backdrop-blur-lg rounded-full border border-gray-700 px-4 py-2 shadow-2xl flex items-center gap-4">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-3 py-1 bg-gray-900/70 rounded-full"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
            <img src={club} className="text-white font-bold text-lg"></img>
          </div>
          <div>
            <div className="text-[10px] text-gray-300">AI</div>
            <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 text-sm">
              Coding Club
            </div>
          </div>
        </motion.div>

        {/* Navigation Section */}
        <nav className="flex gap-4">
          {/* Home link depends on admin status */}
          <Link
            to={isAdmin ? "/admin/events" : "/"}
            className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all"
          >
            Home
          </Link>

          {/* Show normal links only for users */}
          {!isAdmin && (
            <>
              <Link to="/about" className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all">
                About
              </Link>
              <Link to="/events" className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all">
                Events
              </Link>
              <Link to="/teams" className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all">
                Teams
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                to={isAdmin ? "/admin/dashboard" : "/user-dashboard"}
                className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={onLogout}   // <-- Use App’s logout handler
                className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="px-2 py-1 text-xs text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-all">
              Login
            </Link>
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default Navigation;
