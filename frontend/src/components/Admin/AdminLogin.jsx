import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API =
  // process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";
  process.env.REACT_APP_API_URL || "";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.isAdmin) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Not authorized");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center overflow-hidden relative px-4 py-8">

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-80px] w-[280px] h-[280px] bg-red-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[280px] h-[280px] bg-red-900/20 blur-[100px] rounded-full"></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_60px_rgba(255,0,0,0.08)]">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-black via-red-950 to-red-800">

          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-xl font-black text-white">
              A
            </div>

            <div className="mt-12">
              <h1 className="text-5xl font-black text-white leading-[0.95] tracking-tight">
                Admin Control
                <br />
                Panel
              </h1>

              <p className="mt-5 text-gray-300 text-sm leading-relaxed max-w-sm">
                Manage projects, assets, sections, and collections with a
                modern enterprise dashboard.
              </p>
            </div>
          </div>

          
        </div>

        {/* RIGHT SIDE */}
        <div className="p-7 sm:p-9 lg:p-10 flex flex-col justify-center bg-[#070707]/80">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-xl font-black text-white">
              A
            </div>
          </div>

          <div>
            <p className="text-red-500 font-medium text-xs tracking-[0.2em] uppercase">
              Administrator
            </p>

            <h2 className="mt-2 text-3xl font-black text-white tracking-tight">
              Welcome Back
            </h2>

            <p className="mt-2 text-gray-500 text-sm">
              Login to access the administrator dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-7 space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@huntsmanoptics.com"
                required
                className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm text-white font-semibold shadow-lg shadow-red-900/30 mt-2"
            >
              {loading ? "Signing In..." : "Login to Dashboard"}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-7 text-center border-t border-white/5 pt-5">
            <p className="text-gray-500 text-sm">
              Need administrator access?
            </p>

            <Link
              to="/admin/register"
              className="inline-flex items-center gap-2 mt-2 text-red-500 hover:text-red-400 text-sm font-medium transition"
            >
              Create Admin Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;