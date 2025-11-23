import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import Gallery from './pages/Gallery'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AuthProvider>

      {/* Entire app handles layout INSIDE each page */}
      <Routes>

        {/* Default → redirect to Gallery */}
        <Route path="/" element={<Navigate to="/gallery" replace />} />

        {/* Public Pages */}
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Route */}
        <Route 
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </AuthProvider>
  )
}
