import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// ===== Components =====
import Navigation from "./Navigation";
import Home from "./Home";
import AboutPage from "./AboutPage";
import EventsPage from "./EventsPage";
import Footer from "./Footer";
import AuthPage from "./AuthPage";
import TeamPage from "./TeamPage";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";     // 📊 Analytics page
import AdminEventsPage from "./AdminEventsPage";   // 🎯 Event management

const App = () => {
  const [user, setUser] = useState(null);       // auth user
  const [profile, setProfile] = useState(null); // profile table
  const [loading, setLoading] = useState(true);

  // ================= FETCH USER + PROFILE =================
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

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
      } else {
        setProfile(profileData);
      }

      setLoading(false);
    };

    getUser();

    // 🔄 Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ================= ROUTE GUARDS =================
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="text-white text-center p-8">Loading...</div>;
    if (!user) return <Navigate to="/auth" replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (loading) return <div className="text-white text-center p-8">Loading...</div>;
    if (profile?.role !== "admin") return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <Navigation
        user={profile}
        onLogout={handleLogout}
        isAdmin={profile?.role === "admin"}
      />

      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {profile?.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Home />
              )}
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
              {profile?.role === "admin" ? (
                <Navigate to="/admin/events" replace />
              ) : (
                <EventsPage />
              )}
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

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard /> {/* 📊 Google-Form style analytics */}
            </AdminRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <AdminEventsPage /> {/* 🎯 Event CRUD */}
            </AdminRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
