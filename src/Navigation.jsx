/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import club from "../assets/aicc-logo-white.png";

const NavItem = ({ to, children }) => (
  <Link
    to={to}
    className="px-3 py-1 rounded-full border border-pink-500/40 text-pink-400
               hover:bg-pink-500/10 transition text-sm"
  >
    {children}
  </Link>
);

const Navigation = ({ user, isAdmin, onLogout }) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="bg-gray-800/90 backdrop-blur-xl rounded-full
                      border border-gray-700 px-6 py-2 shadow-xl
                      flex items-center gap-6">

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
        <nav className="flex items-center gap-3">

          {/* USER NAVIGATION */}
          {!isAdmin && (
            <>
              <NavItem to="/">Home</NavItem>
              <NavItem to="/about">About</NavItem>
              <NavItem to="/events">Events</NavItem>
              <NavItem to="/teams">Team</NavItem>
              <NavItem to="/user-dashboard">Dashboard</NavItem>
            </>
          )}

          {/* ADMIN NAVIGATION (UNCHANGED STYLE) */}
          {isAdmin && (
            <>
              <NavItem to="/admin/dashboard">Home</NavItem>
              <NavItem to="/admin/dashboard">Dashboard</NavItem>
              <NavItem to="/admin/events">Manage Events</NavItem>
            </>
          )}

          {/* AUTH */}
          {user ? (
            <button
              onClick={onLogout}
              className="px-3 py-1 rounded-full text-red-400
                         hover:bg-red-500/10 transition text-sm"
            >
              Logout
            </button>
          ) : (
            <NavItem to="/auth">Login</NavItem>
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default Navigation;
