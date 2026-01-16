/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiInfo,
  FiCalendar,
  FiUsers,
  FiGrid,
  FiLogOut,
} from "react-icons/fi";
import club from "../assets/aicc-logo-white.png";

const NavItem = ({ to, label, icon: Icon, active }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-2
      rounded-full border transition whitespace-nowrap
      px-3 py-1.5
      text-sm lg:text-base
      ${
        active
          ? "bg-pink-500/20 border-pink-400 text-pink-300"
          : "border-pink-500/40 text-pink-400 hover:bg-pink-500/10"
      }
    `}
  >
    <Icon size={16} className="lg:size-5" />
    <span className="hidden sm:inline">{label}</span>
  </Link>
);

const Navigation = ({ user, isAdmin, onLogout }) => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setHidden(current > lastScrollY && current > 100);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (path) => location.pathname === path;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="
              bg-gray-800/80 backdrop-blur-xl
              border border-gray-700 shadow-2xl
              rounded-full
              px-4 lg:px-8 py-3
              flex items-center gap-3 lg:gap-5
            "
          >
            {/* LOGO (desktop only) */}
            <Link to="/" className="hidden lg:flex items-center gap-2 mr-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <img src={club} alt="AICC" className="w-7" />
              </div>
            </Link>

            <nav className="flex items-center gap-2 lg:gap-4">
              {!isAdmin && (
                <>
                  <NavItem
                    to="/"
                    label="Home"
                    icon={FiHome}
                    active={isActive("/")}
                  />
                  <NavItem
                    to="/about"
                    label="About"
                    icon={FiInfo}
                    active={isActive("/about")}
                  />
                  <NavItem
                    to="/events"
                    label="Events"
                    icon={FiCalendar}
                    active={isActive("/events")}
                  />
                  <NavItem
                    to="/teams"
                    label="Team"
                    icon={FiUsers}
                    active={isActive("/teams")}
                  />
                  {user ? (
                    <NavItem
                      to="/user-dashboard"
                      label="Dashboard"
                      icon={FiGrid}
                      active={isActive("/user-dashboard")}
                    />
                  ) : (
                    <NavItem
                      to="/auth"
                      label="Login"
                      icon={FiLogOut}
                      active={isActive("/auth")}
                    />
                  )}
                </>
              )}

              {isAdmin && (
                <>
                  <NavItem
                    to="/"
                    label="Home"
                    icon={FiHome}
                    active={isActive("/")}
                  />
                  <NavItem
                    to="/admin/dashboard"
                    label="Dashboard"
                    icon={FiGrid}
                    active={isActive("/admin/dashboard")}
                  />
                  <NavItem
                    to="/admin/events"
                    label="Events"
                    icon={FiCalendar}
                    active={isActive("/admin/events")}
                  />
                </>
              )}

              {user && (
                <button
                  onClick={onLogout}
                  className="
                    rounded-full border border-red-500/40
                    text-red-400 hover:bg-red-500/10
                    transition px-3 py-1.5
                  "
                  title="Logout"
                >
                  <FiLogOut size={18} />
                </button>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
