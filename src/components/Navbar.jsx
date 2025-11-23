import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Left Section - Logo + Title */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold shadow-md"
            style={{
              background: "linear-gradient(90deg, #00d4ff, #008cff)",
            }}
          >
            A
          </div>

          <Link
            to="/"
            className="text-2xl font-semibold text-white tracking-wide hover:text-cyan-300 transition"
          >
            AetherGallery
          </Link>

          {/* Navigation Links (center) */}
          <nav className="hidden md:flex gap-8 ml-10 text-gray-300 text-sm">
            <Link className="hover:text-white transition" to="/">Home</Link>
            <Link className="hover:text-white transition" to="/gallery">Gallery</Link>
            <Link className="hover:text-white transition" to="/about">About</Link>
            <Link className="hover:text-white transition" to="/contact">Contact</Link>
          </nav>
        </div>

        {/* Right Section - Login / Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white/10 text-gray-200 rounded-lg hover:bg-white/20 transition"
              >
                Dashboard
              </Link>

              <button
                onClick={() => { logout(); nav("/login"); }}
                className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>

              <div className="px-4 py-2 bg-white/10 rounded-lg text-gray-200 hover:bg-white/20 cursor-pointer transition">
                {user.email?.split("@")[0]} ▾
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
