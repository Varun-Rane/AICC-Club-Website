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
import ResetPassword from "./ResetPassword"; // ✅ ADDED
import TeamPage from "./TeamPage";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminEventsPage from "./AdminEventsPage";

const App = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    getUser();

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

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

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

        {/* 🔑 RESET PASSWORD (NO GUARD) */}
        <Route path="/reset-password" element={<ResetPassword />} />

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

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
