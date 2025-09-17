import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import Navigation from "./Navigation";
import Home from "./Home";
import AboutPage from "./AboutPage";
import EventsPage from "./EventsPage";
import Footer from "./Footer";
import AuthPage from "./AuthPage";
import TeamPage from "./TeamPage";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminEventsPage from "./AdminEventsPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user on app load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data); // { id, name, email, role, isAdmin, ... }
      } catch (error) {
        console.error("Failed to fetch user:", error.response?.data || error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Protect routes for logged-in users
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="text-white text-center p-8">Loading...</div>;
    if (!user) return <Navigate to="/auth" replace />;
    return children;
  };

  // Protect routes for admin users only
  const AdminRoute = ({ children }) => {
    if (loading) return <div className="text-white text-center p-8">Loading...</div>;
    if (!user?.isAdmin) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Navigation user={user} onLogout={handleLogout} isAdmin={user?.isAdmin} />
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />

        {/* User routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.isAdmin ? <Navigate to="/admin/events" replace /> : <Home />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AboutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              {user?.isAdmin ? <Navigate to="/admin/events" replace /> : <EventsPage />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AdminEventsPage />
            </AdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
