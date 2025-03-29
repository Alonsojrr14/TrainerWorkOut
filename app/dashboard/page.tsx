"use client"

import DashboardStats from "../components/DashboardStats"
import WorkoutProgress from "../components/WorkoutProgress"
import RecentWorkouts from "../components/RecentWorkouts"
import AIRecommendations from "../components/AIRecommendations"
import ProtectedRoute from "../components/ProtectedRoute"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStats />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WorkoutProgress />
          <RecentWorkouts />
        </div>
        <div className="mt-8">
          <AIRecommendations />
        </div>
      </div>
    </ProtectedRoute>
  )
}

