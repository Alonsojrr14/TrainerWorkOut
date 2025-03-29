"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { login, register, isAuthenticated } from "../services/authService"
import { useRouter } from "next/navigation"
import { Dumbbell, Mail, Lock, User, Loader2, ArrowRight, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/")
    }
  }, [router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await login(loginData)

      if (result.success) {
        // Force a page reload to ensure all components recognize the auth state
        window.location.href = "/"
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const result = await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      })

      if (result.success) {
        // Force a page reload to ensure all components recognize the auth state
        window.location.href = "/"
      } else {
        setError(result.message || "Registration failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-pokedex-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-pokemon-yellow mb-4">
                <Dumbbell className="h-8 w-8 text-pokemon-black" />
              </div>
              <h1 className="text-2xl font-extrabold text-pokedex-red">TrainerWorkOut</h1>
              <p className="mt-2 text-sm text-pokedex-black">Your personal fitness companion</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-pokedex-black text-center">
                {isLogin ? "Sign in to your account" : "Create a new account"}
              </h2>
            </div>

            {error && (
              <div className="mb-6 bg-pokeball-red/10 border-l-4 border-pokeball-red p-4 rounded">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-pokeball-red">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isLogin ? (
              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-pokedex-black">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-pokeball-gray" />
                      </div>
                      <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-pokeball-gray/30 rounded-md shadow-sm placeholder-pokeball-gray focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue sm:text-sm"
                        placeholder="you@example.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-pokedex-black">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-pokeball-gray" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-pokeball-gray/30 rounded-md shadow-sm placeholder-pokeball-gray focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue sm:text-sm"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-pokemon-blue focus:ring-pokemon-blue border-pokeball-gray/30 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-pokedex-black">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-pokemon-blue hover:text-pokemon-blue/80">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-pokedex-white bg-pokedex-red hover:bg-pokeball-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokedex-red disabled:bg-pokedex-red/70 transition-colors"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : (
                      <ArrowRight className="h-5 w-5 mr-2" />
                    )}
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>

                <div className="text-center text-sm text-pokedex-black bg-pokemon-yellow/20 p-3 rounded-md">
                  <p className="font-medium mb-1">Demo credentials:</p>
                  <p>Email: john@example.com</p>
                  <p>Password: password123</p>
                  <p className="mt-1 font-medium">Demo user: Zero</p>
                </div>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleRegisterSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-pokedex-black">
                      Full name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-pokeball-gray" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-pokeball-gray/30 rounded-md shadow-sm placeholder-pokeball-gray focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue sm:text-sm"
                        placeholder="Zero"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-pokedex-black">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-pokeball-gray" />
                      </div>
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-pokeball-gray/30 rounded-md shadow-sm placeholder-pokeball-gray focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue sm:text-sm"
                        placeholder="you@example.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-pokedex-black">
                      Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-pokeball-gray" />
                      </div>
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-pokeball-gray/30 rounded-md shadow-sm placeholder-pokeball-gray focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue sm:text-sm"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-pokedex-black">
                      Confirm password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-pokeball-gray" />
                      </div>
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-pokeball-gray/30 rounded-md shadow-sm placeholder-pokeball-gray focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue sm:text-sm"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-pokedex-white bg-pokedex-red hover:bg-pokeball-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokedex-red disabled:bg-pokedex-red/70 transition-colors"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <User className="h-5 w-5 mr-2" />}
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-pokedex-black">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="ml-1 font-medium text-pokemon-blue hover:text-pokemon-blue/80 focus:outline-none"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-pokemon-yellow/10 border-t border-pokeball-gray/20 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-pokemon-blue hover:text-pokemon-blue/80"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

