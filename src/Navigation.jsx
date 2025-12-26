/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import club from "../assets/aicc-logo-white.png";

const Navigation = ({ user, isAdmin, onLogout }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-gray-800/90 backdrop-blur-xl rounded-full border border-gray-700 px-5 py-2 shadow-xl flex items-center gap-6">

        {/* LOGO */}
        <Link
          to={isAdmin ? "/admin/dashboard" : "/"}
          className="flex items-center gap-2"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <img src={club} alt="AICC" />
          </div>
          <div className="leading-tight">
            <div className="text-xs text-gray-300">AI &</div>
            <div className="text-sm font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              Coding Club
            </div>
          </div>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-4 text-sm">

          {/* COMMON */}
          <Link
            to={isAdmin ? "/admin/dashboard" : "/"}
            className="nav-link border border-pink-500/40 px-3 py-1 rounded-full text-pink-400 hover:bg-pink-500/10"
          >
            Home
          </Link>

          {/* USER LINKS */}
          {!isAdmin && (
            <>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/events" className="nav-link">Events</Link>
              <Link to="/teams" className="nav-link">Team</Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <Link to="/admin/dashboard" className="nav-link border border-pink-500/40 px-3 py-1 rounded-full text-pink-400 hover:bg-pink-500/10">
                Dashboard
              </Link>
              <Link
                to="/admin/events"
                className="nav-link border border-pink-500/40 px-3 py-1 rounded-full text-pink-400 hover:bg-pink-500/10"
              >
                Manage Events
              </Link>
            </>
          )}

          {/* AUTH */}
          {user ? (
            <button
              onClick={onLogout}
              className="nav-link text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default Navigation;
