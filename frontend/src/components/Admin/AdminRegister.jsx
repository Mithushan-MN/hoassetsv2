import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const AdminRegister = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          isAdmin: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Administrator account created");

        if (data.token) {
          localStorage.setItem("adminToken", data.token);
        }

        navigate("/admin/dashboard");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center overflow-hidden relative mt-8 px-4 py-8">

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-80px] w-[280px] h-[280px] bg-red-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[280px] h-[280px] bg-red-900/20 blur-[100px] rounded-full"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-4xl grid lg:grid-cols-2 rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_0_60px_rgba(255,0,0,0.08)]">

        {/* Left */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-black via-red-950 to-red-800">

          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-xl font-black text-white">
              A
            </div>

            <div className="mt-12">
              <h1 className="text-5xl font-black text-white leading-[0.95] tracking-tight">
                Create Admin
                <br />
                Account
              </h1>

              <p className="mt-5 text-gray-300 text-sm leading-relaxed max-w-sm">
                Secure administrator access for managing assets, projects,
                wrappers, and categories.
              </p>
            </div>
          </div>

        </div>

        {/* Right */}
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
              Register
            </h2>

            <p className="mt-2 text-gray-500 text-sm">
              Create a new administrator account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="mt-7 space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Huntsman optics"
                required
                className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Company Email
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
                placeholder="Create secure password"
                required
                className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="w-full h-12 rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm text-white font-semibold shadow-lg shadow-red-900/30 mt-2"
            >
              {loading ? "Creating Account..." : "Create Administrator"}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-7 text-center border-t border-white/5 pt-5">
            <p className="text-gray-500 text-sm">
              Already have an account?
            </p>

            <Link
              to="/admin"
              className="inline-flex items-center gap-2 mt-2 text-red-500 hover:text-red-400 text-sm font-medium transition"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;