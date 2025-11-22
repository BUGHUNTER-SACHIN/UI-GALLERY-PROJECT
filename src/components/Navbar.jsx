import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black flex items-center justify-center font-bold">
          A
        </div>
        <Link to="/" className="text-xl font-bold">AetherGallery</Link>
      </div>

      <nav className="flex items-center gap-4">
        <Link to="/gallery" className="hover:underline">Gallery</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <button
              onClick={() => { logout(); nav('/login') }}
              className="px-3 py-1 bg-red-600 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="px-3 py-1 bg-blue-600 rounded">
            Login
          </Link>
        )}
      </nav>
    </header>
  )
}
