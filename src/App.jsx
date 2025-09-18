import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient"; // your supabase client

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
  const [user, setUser] = useState(null); // supabase user
  const [profile, setProfile] = useState(null); // profile from DB
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user + profile
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUser(user);

      // fetch profile from "profiles" table
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    getUser();

    // subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
    if (profile?.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Navigation user={profile} onLogout={handleLogout} isAdmin={profile?.role === "admin"} />
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />

        {/* User routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {profile?.role === "admin" ? <Navigate to="/admin/events" replace /> : <Home />}
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
              {profile?.role === "admin" ? <Navigate to="/admin/events" replace /> : <EventsPage />}
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
              <UserDashboard user={profile} />
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