import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../src/supabaseClient";

const AuthPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });
        if (error) throw error;

        const user = data.user;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, name, college, phone, role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        const fullUser = { ...user, ...profile };
        setUser(fullUser);

        fullUser.role === "admin"
          ? navigate("/admin-dashboard")
          : navigate("/user-dashboard");
      } else {
        // SIGNUP
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                name,
                college,
                phone,
                role: "user",
              },
            ]);

          if (profileError) throw profileError;
        }

        setSuccess("✅ Signup successful! Please verify your email.");
        setTimeout(() => setIsLogin(true), 2500);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-500 text-green-300 px-4 py-2 rounded mb-4 text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded"
                required
              />
              <input
                type="text"
                placeholder="College"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded"
            required
          />

          {/* PASSWORD WITH TOGGLE */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-sm text-pink-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-105"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccess("");
              }}
              className="text-pink-400 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
