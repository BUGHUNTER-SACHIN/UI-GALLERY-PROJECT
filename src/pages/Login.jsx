import React, { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) setError(error.message)
    else nav('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white/5 p-6 rounded">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <div className="bg-red-600 p-2 mb-4 rounded">{error}</div>}
      
      <form onSubmit={handleLogin} className="space-y-3">
        <input className="w-full p-2 rounded bg-transparent border"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)} />
        
        <input type="password"
          className="w-full p-2 rounded bg-transparent border"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)} />

        <button className="w-full py-2 bg-blue-600 rounded">Login</button>
      </form>

      <p className="mt-4 text-sm">Don’t have an account? 
        <Link to="/signup" className="underline">Sign Up</Link>
      </p>
    </div>
  )
}
