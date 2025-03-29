"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { User, Upload, Camera, Save, Loader2 } from "lucide-react"
import ProtectedRoute from "../../components/ProtectedRoute"
import { getCurrentUser, type User as UserType } from "../../services/authService"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    height: "",
    weight: "",
    fitnessGoal: "weight-loss",
    activityLevel: "moderate",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user data
  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setProfileImage(currentUser.avatar || null)

      // Initialize form with user data
      setFormData((prevData) => ({
        ...prevData,
        name: currentUser.name || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        height: currentUser.height || "",
        weight: currentUser.weight || "",
        fitnessGoal: currentUser.fitnessGoal || "weight-loss",
        activityLevel: currentUser.activityLevel || "moderate",
      }))
    }
    setLoading(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Read the file as a data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileImage(event.target.result as string)
        setIsUploading(false)
      }
    }
    reader.onerror = () => {
      console.error("Error reading file")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // In a real app, you would send this data to your API
      // For now, we'll just update the user in localStorage

      // Get the current user
      const currentUser = getCurrentUser()
      if (!currentUser) {
        throw new Error("User not found")
      }

      // Update user data
      const updatedUser: UserType = {
        ...currentUser,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        height: formData.height,
        weight: formData.weight,
        fitnessGoal: formData.fitnessGoal,
        activityLevel: formData.activityLevel,
        avatar: profileImage || currentUser.avatar,
      }

      // Save to localStorage
      localStorage.setItem("fittrack_user", JSON.stringify(updatedUser))

      // Update state
      setUser(updatedUser)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const takePicture = async () => {
    try {
      // Check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser doesn't support camera access")
        return
      }

      // Get video stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      // Create video element to display the stream
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve
      })

      // Create canvas to capture the image
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/png")
        setProfileImage(imageDataUrl)
      }

      // Stop all video streams
      stream.getTracks().forEach((track) => track.stop())
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Failed to access camera. Please check permissions.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-pokemon-blue animate-spin" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-pokedex-black mb-6">My Profile</h1>

        <div className="bg-pokedex-white shadow rounded-lg overflow-hidden border border-pokeball-gray/10">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden bg-pokeball-gray/10 border-4 border-pokemon-blue shadow-lg">
                    {isUploading ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-pokemon-blue animate-spin" />
                      </div>
                    ) : profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-pokemon-blue/10">
                        <User className="h-16 w-16 text-pokemon-blue/50" />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="inline-flex items-center px-3 py-2 border border-pokeball-gray/30 shadow-sm text-sm leading-4 font-medium rounded-md text-pokedex-black bg-pokedex-white hover:bg-pokeball-gray/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokemon-blue"
                  >
                    <Upload className="h-4 w-4 mr-2 text-pokemon-blue" />
                    Upload
                  </button>

                  <button
                    type="button"
                    onClick={takePicture}
                    className="inline-flex items-center px-3 py-2 border border-pokeball-gray/30 shadow-sm text-sm leading-4 font-medium rounded-md text-pokedex-black bg-pokedex-white hover:bg-pokeball-gray/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokemon-blue"
                  >
                    <Camera className="h-4 w-4 mr-2 text-pokemon-blue" />
                    Camera
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-xl font-semibold text-pokedex-black mb-4">Personal Information</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-pokedex-black">
                        Full name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-pokedex-black">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-pokedex-black">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                          placeholder="Tell us a bit about yourself"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="height" className="block text-sm font-medium text-pokedex-black">
                        Height (cm)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="height"
                          id="height"
                          value={formData.height}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                          placeholder="175"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="weight" className="block text-sm font-medium text-pokedex-black">
                        Weight (kg)
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="weight"
                          id="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                          placeholder="70"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="fitnessGoal" className="block text-sm font-medium text-pokedex-black">
                        Fitness Goal
                      </label>
                      <div className="mt-1">
                        <select
                          id="fitnessGoal"
                          name="fitnessGoal"
                          value={formData.fitnessGoal}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                        >
                          <option value="weight-loss">Weight Loss</option>
                          <option value="muscle-gain">Muscle Gain</option>
                          <option value="endurance">Endurance</option>
                          <option value="flexibility">Flexibility</option>
                          <option value="general-fitness">General Fitness</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="activityLevel" className="block text-sm font-medium text-pokedex-black">
                        Activity Level
                      </label>
                      <div className="mt-1">
                        <select
                          id="activityLevel"
                          name="activityLevel"
                          value={formData.activityLevel}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-pokemon-blue focus:border-pokemon-blue block w-full sm:text-sm border-pokeball-gray/30 rounded-md"
                        >
                          <option value="sedentary">Sedentary (little or no exercise)</option>
                          <option value="light">Light (exercise 1-3 times/week)</option>
                          <option value="moderate">Moderate (exercise 3-5 times/week)</option>
                          <option value="active">Active (exercise 6-7 times/week)</option>
                          <option value="very-active">Very Active (hard exercise daily)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={saving}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-pokedex-white bg-pokedex-red hover:bg-pokeball-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pokedex-red disabled:bg-pokedex-red/70"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Save Profile
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
      </div>
    </ProtectedRoute>
  )
}

