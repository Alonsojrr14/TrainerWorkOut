"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Moon, Sun, Save, Loader2, Bell, User, Shield, Dumbbell, Link2, AlertTriangle, Info } from "lucide-react"
import ProtectedRoute from "../../components/ProtectedRoute"
import { useTheme } from "../../contexts/ThemeContext"
import { getCurrentUser, type User as UserType } from "../../services/authService"
import { useRouter } from "next/navigation"

// Define the settings sections and their respective icons
const settingsSections = [
  { id: "appearance", label: "Appearance", icon: Sun },
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "workout", label: "Workout Preferences", icon: Dumbbell },
  { id: "connected", label: "Connected Accounts", icon: Link2 },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("appearance")
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")
  const [user, setUser] = useState<UserType | null>(getCurrentUser())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  // Form state for various settings
  const [formState, setFormState] = useState({
    // Appearance
    theme: theme,
    colorScheme: "default",

    // Account
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    workoutReminders: true,
    achievementAlerts: true,

    // Privacy
    dataSharing: false,
    profileVisibility: "friends",
    activityTracking: true,

    // Workout Preferences
    units: "metric",
    workoutGoal: user?.fitnessGoal || "weight-loss",
    difficultyLevel: "intermediate",
    workoutDuration: "30",

    // Connected Accounts
    googleConnected: false,
    appleConnected: false,
    fitbitConnected: true,
    stravaConnected: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme)
    setFormState((prev) => ({ ...prev, theme: newTheme }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedMessage("")

    // Validate password fields if they're filled
    if (activeSection === "account" && formState.newPassword) {
      if (formState.newPassword !== formState.confirmPassword) {
        alert("New passwords don't match")
        setSaving(false)
        return
      }

      if (!formState.currentPassword) {
        alert("Please enter your current password")
        setSaving(false)
        return
      }
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would save these settings to your backend
    // For now, we'll just show a success message
    setSaving(false)
    setSavedMessage("Settings saved successfully!")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSavedMessage("")
    }, 3000)
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== user?.email) {
      alert("Email doesn't match")
      return
    }

    setSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would delete the account via your backend
    alert("Account deleted successfully")

    // Redirect to login page
    window.location.href = "/login"
  }

  const toggleConnection = (service: string) => {
    setFormState((prev) => ({
      ...prev,
      [`${service}Connected`]: !prev[`${service}Connected` as keyof typeof prev],
    }))
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-pokedex-black dark:text-pokedex-white mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Navigation Sidebar */}
          <div className="w-full md:w-64 bg-pokedex-white dark:bg-pokemon-black/60 rounded-lg shadow border border-pokeball-gray/10 dark:border-pokeball-gray/30 overflow-hidden">
            <nav className="p-2">
              <ul className="space-y-1">
                {settingsSections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-pokemon-blue text-pokedex-white"
                          : "text-pokedex-black dark:text-pokedex-white hover:bg-pokeball-gray/10 dark:hover:bg-pokeball-gray/20"
                      }`}
                    >
                      <section.icon className="h-5 w-5 mr-3" />
                      <span>{section.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 bg-pokedex-white dark:bg-pokemon-black/60 rounded-lg shadow border border-pokeball-gray/10 dark:border-pokeball-gray/30 overflow-hidden">
            <div className="p-6">
              <form ref={formRef} onSubmit={handleSaveSettings} className="space-y-8">
                {/* Appearance Settings */}
                {activeSection === "appearance" && (
                  <div>
                    <h2 className="text-xl font-semibold text-pokedex-black dark:text-pokedex-white mb-6">
                      Appearance
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">Theme</label>
                        <div className="mt-3 flex gap-4">
                          <div
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                              formState.theme === "light"
                                ? "border-pokemon-blue bg-pokemon-blue/10"
                                : "border-pokeball-gray/30 hover:border-pokeball-gray/50"
                            }`}
                            onClick={() => handleThemeChange("light")}
                          >
                            <div className="w-12 h-12 bg-pokedex-white rounded-full flex items-center justify-center shadow-inner">
                              <Sun className="h-6 w-6 text-pokemon-yellow" />
                            </div>
                            <span className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                              Light
                            </span>
                          </div>

                          <div
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer border-2 transition-all ${
                              formState.theme === "dark"
                                ? "border-pokemon-blue bg-pokemon-blue/10"
                                : "border-pokeball-gray/30 hover:border-pokeball-gray/50"
                            }`}
                            onClick={() => handleThemeChange("dark")}
                          >
                            <div className="w-12 h-12 bg-pokedex-black rounded-full flex items-center justify-center shadow-inner">
                              <Moon className="h-6 w-6 text-pokedex-blue" />
                            </div>
                            <span className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">Dark</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="colorScheme"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Color Scheme
                        </label>
                        <select
                          id="colorScheme"
                          name="colorScheme"
                          value={formState.colorScheme}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-pokeball-gray/30 focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue rounded-md bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        >
                          <option value="default">Default (Pokémon)</option>
                          <option value="classic">Classic Red</option>
                          <option value="ocean">Ocean Blue</option>
                          <option value="forest">Forest Green</option>
                          <option value="sunset">Sunset Orange</option>
                        </select>
                        <p className="mt-1 text-sm text-pokeball-gray">
                          Choose a color scheme for the application interface.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeSection === "account" && (
                  <div>
                    <h2 className="text-xl font-semibold text-pokedex-black dark:text-pokedex-white mb-6">
                      Account Settings
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-pokeball-gray/30 rounded-md shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        />
                      </div>

                      <div className="border-t border-pokeball-gray/20 dark:border-pokeball-gray/10 pt-6">
                        <h3 className="text-lg font-medium text-pokedex-black dark:text-pokedex-white mb-4">
                          Change Password
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="currentPassword"
                              className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                            >
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              id="currentPassword"
                              value={formState.currentPassword}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border-pokeball-gray/30 rounded-md shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="newPassword"
                              className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                            >
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              id="newPassword"
                              value={formState.newPassword}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border-pokeball-gray/30 rounded-md shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="confirmPassword"
                              className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                            >
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              value={formState.confirmPassword}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border-pokeball-gray/30 rounded-md shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-pokeball-gray/20 dark:border-pokeball-gray/10 pt-6">
                        <h3 className="text-lg font-medium text-pokedex-red dark:text-pokeball-red mb-4">
                          Danger Zone
                        </h3>

                        {!showDeleteConfirm ? (
                          <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-pokeball-red/10 text-pokeball-red border border-pokeball-red/30 rounded-md hover:bg-pokeball-red/20 transition-colors"
                          >
                            Delete Account
                          </button>
                        ) : (
                          <div className="bg-pokeball-red/5 border border-pokeball-red/30 rounded-md p-4">
                            <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 text-pokeball-red mr-2 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium text-pokeball-red">Delete your account?</h4>
                                <p className="mt-1 text-sm text-pokedex-black dark:text-pokedex-white">
                                  This action cannot be undone. All your data will be permanently deleted.
                                </p>
                                <div className="mt-3">
                                  <label
                                    htmlFor="deleteConfirm"
                                    className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                                  >
                                    Type your email to confirm: <span className="font-bold">{user?.email}</span>
                                  </label>
                                  <input
                                    type="email"
                                    id="deleteConfirm"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    className="mt-1 block w-full border-pokeball-gray/30 rounded-md shadow-sm focus:ring-pokeball-red focus:border-pokeball-red bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                                  />
                                </div>
                                <div className="mt-4 flex space-x-3">
                                  <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={deleteInput !== user?.email}
                                    className="px-3 py-1.5 bg-pokeball-red text-pokedex-white rounded-md hover:bg-pokeball-red/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Delete Account
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowDeleteConfirm(false)
                                      setDeleteInput("")
                                    }}
                                    className="px-3 py-1.5 bg-pokeball-gray/20 text-pokedex-black dark:text-pokedex-white rounded-md hover:bg-pokeball-gray/30 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeSection === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold text-pokedex-black dark:text-pokedex-white mb-6">
                      Notification Settings
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                            Email Notifications
                          </h3>
                          <p className="text-sm text-pokeball-gray">Receive updates and reminders via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={formState.emailNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-pokeball-gray/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pokemon-blue/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pokemon-blue"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                            Push Notifications
                          </h3>
                          <p className="text-sm text-pokeball-gray">Receive notifications on your device</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={formState.pushNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-pokeball-gray/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pokemon-blue/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pokemon-blue"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                            Workout Reminders
                          </h3>
                          <p className="text-sm text-pokeball-gray">Get reminded about scheduled workouts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="workoutReminders"
                            checked={formState.workoutReminders}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-pokeball-gray/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pokemon-blue/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pokemon-blue"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                            Achievement Alerts
                          </h3>
                          <p className="text-sm text-pokeball-gray">Get notified when you earn achievements</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="achievementAlerts"
                            checked={formState.achievementAlerts}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-pokeball-gray/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pokemon-blue/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pokemon-blue"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeSection === "privacy" && (
                  <div>
                    <h2 className="text-xl font-semibold text-pokedex-black dark:text-pokedex-white mb-6">
                      Privacy Settings
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                            Data Sharing
                          </h3>
                          <p className="text-sm text-pokeball-gray">Share workout data with third-party services</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="dataSharing"
                            checked={formState.dataSharing}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-pokeball-gray/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pokemon-blue/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pokemon-blue"></div>
                        </label>
                      </div>

                      <div>
                        <label
                          htmlFor="profileVisibility"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Profile Visibility
                        </label>
                        <select
                          id="profileVisibility"
                          name="profileVisibility"
                          value={formState.profileVisibility}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-pokeball-gray/30 focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue rounded-md bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        >
                          <option value="public">Public - Anyone can view your profile</option>
                          <option value="friends">Friends Only - Only friends can view your profile</option>
                          <option value="private">Private - Only you can view your profile</option>
                        </select>
                        <p className="mt-1 text-sm text-pokeball-gray">
                          Control who can see your profile and workout history.
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                            Activity Tracking
                          </h3>
                          <p className="text-sm text-pokeball-gray">Allow the app to track your workout activities</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="activityTracking"
                            checked={formState.activityTracking}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-pokeball-gray/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pokemon-blue/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pokemon-blue"></div>
                        </label>
                      </div>

                      <div className="bg-pokemon-blue/5 border border-pokemon-blue/20 rounded-md p-4 flex items-start">
                        <Info className="h-5 w-5 text-pokemon-blue mr-2 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-pokemon-blue">Privacy Policy</h4>
                          <p className="mt-1 text-sm text-pokedex-black dark:text-pokedex-white">
                            Read our{" "}
                            <a href="#" className="text-pokemon-blue underline">
                              privacy policy
                            </a>{" "}
                            to learn more about how we handle your data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Workout Preferences */}
                {activeSection === "workout" && (
                  <div>
                    <h2 className="text-xl font-semibold text-pokedex-black dark:text-pokedex-white mb-6">
                      Workout Preferences
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="units"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Measurement Units
                        </label>
                        <select
                          id="units"
                          name="units"
                          value={formState.units}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-pokeball-gray/30 focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue rounded-md bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        >
                          <option value="metric">Metric (kg, cm)</option>
                          <option value="imperial">Imperial (lb, in)</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="workoutGoal"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Workout Goal
                        </label>
                        <select
                          id="workoutGoal"
                          name="workoutGoal"
                          value={formState.workoutGoal}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-pokeball-gray/30 focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue rounded-md bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        >
                          <option value="weight-loss">Weight Loss</option>
                          <option value="muscle-gain">Muscle Gain</option>
                          <option value="endurance">Endurance</option>
                          <option value="flexibility">Flexibility</option>
                          <option value="general-fitness">General Fitness</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="difficultyLevel"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Difficulty Level
                        </label>
                        <select
                          id="difficultyLevel"
                          name="difficultyLevel"
                          value={formState.difficultyLevel}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-pokeball-gray/30 focus:outline-none focus:ring-pokemon-blue focus:border-pokemon-blue rounded-md bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="workoutDuration"
                          className="block text-sm font-medium text-pokedex-black dark:text-pokedex-white"
                        >
                          Default Workout Duration (minutes)
                        </label>
                        <input
                          type="number"
                          name="workoutDuration"
                          id="workoutDuration"
                          min="5"
                          max="120"
                          value={formState.workoutDuration}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-pokeball-gray/30 rounded-md shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue bg-pokedex-white dark:bg-pokemon-black/40 text-pokedex-black dark:text-pokedex-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Connected Accounts */}
                {activeSection === "connected" && (
                  <div>
                    <h2 className="text-xl font-semibold text-pokedex-black dark:text-pokedex-white mb-6">
                      Connected Accounts
                    </h2>

                    <div className="space-y-4">
                      <div className="bg-pokedex-white dark:bg-pokemon-black/40 p-4 rounded-lg border border-pokeball-gray/20 dark:border-pokeball-gray/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 font-bold">G</span>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">Google</h3>
                              <p className="text-xs text-pokeball-gray">
                                {formState.googleConnected ? "Connected" : "Not connected"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleConnection("google")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              formState.googleConnected
                                ? "bg-pokeball-gray/20 text-pokedex-black dark:text-pokedex-white hover:bg-pokeball-gray/30"
                                : "bg-pokemon-blue text-pokedex-white hover:bg-pokemon-blue/90"
                            }`}
                          >
                            {formState.googleConnected ? "Disconnect" : "Connect"}
                          </button>
                        </div>
                      </div>

                      <div className="bg-pokedex-white dark:bg-pokemon-black/40 p-4 rounded-lg border border-pokeball-gray/20 dark:border-pokeball-gray/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-600 font-bold">A</span>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">
                                Apple Health
                              </h3>
                              <p className="text-xs text-pokeball-gray">
                                {formState.appleConnected ? "Connected" : "Not connected"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleConnection("apple")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              formState.appleConnected
                                ? "bg-pokeball-gray/20 text-pokedex-black dark:text-pokedex-white hover:bg-pokeball-gray/30"
                                : "bg-pokemon-blue text-pokedex-white hover:bg-pokemon-blue/90"
                            }`}
                          >
                            {formState.appleConnected ? "Disconnect" : "Connect"}
                          </button>
                        </div>
                      </div>

                      <div className="bg-pokedex-white dark:bg-pokemon-black/40 p-4 rounded-lg border border-pokeball-gray/20 dark:border-pokeball-gray/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold">F</span>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">Fitbit</h3>
                              <p className="text-xs text-pokeball-gray">
                                {formState.fitbitConnected ? "Connected" : "Not connected"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleConnection("fitbit")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              formState.fitbitConnected
                                ? "bg-pokeball-gray/20 text-pokedex-black dark:text-pokedex-white hover:bg-pokeball-gray/30"
                                : "bg-pokemon-blue text-pokedex-white hover:bg-pokemon-blue/90"
                            }`}
                          >
                            {formState.fitbitConnected ? "Disconnect" : "Connect"}
                          </button>
                        </div>
                      </div>

                      <div className="bg-pokedex-white dark:bg-pokemon-black/40 p-4 rounded-lg border border-pokeball-gray/20 dark:border-pokeball-gray/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <span className="text-orange-600 font-bold">S</span>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-pokedex-black dark:text-pokedex-white">Strava</h3>
                              <p className="text-xs text-pokeball-gray">
                                {formState.stravaConnected ? "Connected" : "Not connected"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleConnection("strava")}
                            className={`px-3 py-1.5 text-sm rounded-md ${
                              formState.stravaConnected
                                ? "bg-pokeball-gray/20 text-pokedex-black dark:text-pokedex-white hover:bg-pokeball-gray/30"
                                : "bg-pokemon-blue text-pokedex-white hover:bg-pokemon-blue/90"
                            }`}
                          >
                            {formState.stravaConnected ? "Disconnect" : "Connect"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-5 border-t border-pokeball-gray/20 dark:border-pokeball-gray/10">
                  <div className="flex items-center justify-between">
                    {savedMessage && <p className="text-sm text-pokedex-green">{savedMessage}</p>}
                    <div className="flex-1"></div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-pokedex-white bg-pokedex-red hover:bg-pokeball-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokedex-red disabled:bg-pokedex-red/70 transition-colors"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

