import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // 🔹 Login
        const response = await axios.post("http://localhost:5000/api/login", {
          email,
          password,
          isAdmin: isAdminLogin,
        });

        const { token, user } = response.data;

        // Store token in localStorage
        localStorage.setItem("token", token);
        setUser(user);

        // Redirect based on role
        navigate(user.isAdmin ? "/admin/events" : "/user-dashboard");
      } else {
        // 🔹 Register
        await axios.post("http://localhost:5000/api/register", {
          name,
          email,
          college,
          phone,
          password,
        });

        setIsLogin(true);
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data || err);
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">College</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg"
              required
            />
          </div>

          {isLogin && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
                className="h-4 w-4 text-pink-500"
              />
              <label className="ml-2 text-sm">Login as Admin</label>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-pink-400 hover:underline font-medium"
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
