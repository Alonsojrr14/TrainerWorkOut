"use client"

import { useState, useEffect } from "react"
import { Dumbbell, ChevronRight, Zap, Play, Pause, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock API call to get AI recommendations
const fetchRecommendations = () => {
  // In a real app, this would be an API call to your backend
  return new Promise<Recommendation[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "High-Intensity Interval Training",
          description: "Boost your metabolism and burn fat with this HIIT workout.",
          details:
            "3 sets of: 30 seconds sprint, 30 seconds rest, 30 seconds burpees, 30 seconds rest. Complete 4 rounds with 2 minutes rest between sets.",
          difficulty: "Advanced",
          duration: "25 min",
          calories: "300-400",
          pokemonReward: "Charizard",
        },
        {
          id: 2,
          name: "Strength Training for Beginners",
          description: "Build muscle and improve overall strength with this beginner-friendly routine.",
          details:
            "3 sets of: 10 squats, 10 push-ups (or knee push-ups), 10 lunges per leg, 30-second plank. Rest 60 seconds between exercises.",
          difficulty: "Beginner",
          duration: "30 min",
          calories: "150-250",
          pokemonReward: "Bulbasaur",
        },
        {
          id: 3,
          name: "Yoga for Flexibility",
          description: "Increase your flexibility and reduce stress with this calming yoga session.",
          details:
            "Flow through: 5 minutes of sun salutations, 10 minutes of standing poses, 10 minutes of seated poses, 5 minutes of final relaxation.",
          difficulty: "Intermediate",
          duration: "30 min",
          calories: "100-150",
          pokemonReward: "Mewtwo",
        },
        {
          id: 4,
          name: "Cardio Blast",
          description: "A high-energy cardio workout to improve your endurance and heart health.",
          details:
            "5 minute warm-up, then 3 rounds of: 1 minute jumping jacks, 1 minute high knees, 1 minute mountain climbers, 1 minute rest. Finish with a 5 minute cool down.",
          difficulty: "Intermediate",
          duration: "20 min",
          calories: "200-300",
          pokemonReward: "Pikachu",
        },
      ])
    }, 1000)
  })
}

interface Recommendation {
  id: number
  name: string
  description: string
  details: string
  difficulty: string
  duration: string
  calories: string
  pokemonReward: string
}

// Update the WorkoutState interface to include initialTime
interface WorkoutState {
  active: boolean
  recommendation: Recommendation | null
  timeRemaining: number
  initialTime: number
  completed: boolean
}

// Update the initial state to include initialTime
const initialWorkoutState: WorkoutState = {
  active: false,
  recommendation: null,
  timeRemaining: 0,
  initialTime: 0,
  completed: false,
}

export default function AIRecommendations() {
  const router = useRouter()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [workout, setWorkout] = useState<WorkoutState>(initialWorkoutState)

  useEffect(() => {
    // Fetch recommendations when component mounts
    setLoading(true)
    fetchRecommendations()
      .then((data) => {
        setRecommendations(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to fetch recommendations:", error)
        setLoading(false)
      })
  }, [])

  // Timer effect for workout
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (workout.active && workout.timeRemaining > 0) {
      timer = setInterval(() => {
        setWorkout((prev) => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        }))
      }, 1000)
    } else if (workout.active && workout.timeRemaining <= 0) {
      setWorkout((prev) => ({
        ...prev,
        active: false,
        completed: true,
      }))
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [workout.active, workout.timeRemaining])

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-pokedex-green/20 text-pokedex-green"
      case "intermediate":
        return "bg-pokemon-yellow/20 text-pokemon-black"
      case "advanced":
        return "bg-pokeball-red/20 text-pokeball-red"
      default:
        return "bg-pokeball-gray/20 text-pokeball-gray"
    }
  }

  // Update the startWorkout function to set initialTime
  const startWorkout = (recommendation: Recommendation) => {
    // Convert duration string to seconds (assuming format like "25 min")
    const durationMatch = recommendation.duration.match(/(\d+)/)
    const minutes = durationMatch ? Number.parseInt(durationMatch[1]) : 1

    // For demo purposes, we'll use a shorter time (10 seconds per minute)
    const seconds = minutes * 10

    setWorkout({
      active: true,
      recommendation: recommendation,
      timeRemaining: seconds,
      initialTime: seconds,
      completed: false,
    })
  }

  // Update the toggleWorkoutState function to only toggle active state
  const toggleWorkoutState = () => {
    setWorkout((prev) => ({
      ...prev,
      active: !prev.active,
    }))
  }

  // Update the cancelWorkout function to reset everything
  const cancelWorkout = () => {
    setWorkout({
      active: false,
      recommendation: null,
      timeRemaining: 0,
      initialTime: 0,
      completed: false,
    })
  }

  // Complete workout and navigate to PokéFit to claim reward
  const claimPokemonReward = () => {
    // In a real app, you would save the workout completion to your backend
    // and then navigate to the PokéFit page

    // For now, we'll just navigate to the PokéFit page
    router.push("/dashboard/pokefit")
  }

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="bg-pokedex-white p-4 sm:p-6 rounded-lg shadow border border-pokeball-gray/10">
      <div className="flex items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-pokedex-black">AI-Powered Workout Recommendations</h2>
        <Zap className="ml-2 h-5 w-5 text-pokemon-yellow" />
      </div>

      {/* Active Workout Display */}
      {(workout.active || workout.completed) && workout.recommendation && (
        <div className="mb-6 p-3 sm:p-4 bg-pokemon-blue/10 rounded-lg border border-pokemon-blue/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-pokemon-blue text-sm sm:text-base">
              {workout.completed ? "Workout Completed!" : "Active Workout"}
            </h3>
            {workout.completed ? (
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-pokedex-green" />
            ) : (
              <div className="text-lg sm:text-xl font-bold text-pokemon-blue">{formatTime(workout.timeRemaining)}</div>
            )}
          </div>

          <p className="font-medium mb-2 text-sm sm:text-base text-pokedex-black">{workout.recommendation.name}</p>

          {workout.completed ? (
            <div className="mt-4">
              <p className="text-pokedex-green mb-3 text-sm sm:text-base">
                Great job! You've completed the workout and earned a reward.
              </p>
              <button
                onClick={claimPokemonReward}
                className="w-full px-3 sm:px-4 py-2 bg-pokedex-green text-pokedex-white rounded-md hover:bg-pokedex-green/90 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <Zap className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Claim {workout.recommendation.pokemonReward} in PokéFit
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              <button
                onClick={toggleWorkoutState}
                className={`flex-1 px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center justify-center text-sm sm:text-base ${
                  workout.active
                    ? "bg-pokemon-yellow text-pokemon-black hover:bg-pokemon-yellow/90"
                    : "bg-pokemon-blue text-pokedex-white hover:bg-pokemon-blue/90"
                }`}
              >
                {workout.active ? (
                  <>
                    <Pause className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Resume
                  </>
                )}
              </button>
              <button
                onClick={cancelWorkout}
                className="px-3 sm:px-4 py-2 bg-pokeball-red/10 text-pokeball-red rounded-md hover:bg-pokeball-red/20 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <XCircle className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 sm:h-12 bg-pokeball-gray/20 rounded-lg mb-2"></div>
              <div className="h-20 sm:h-24 bg-pokeball-gray/10 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border border-pokeball-gray/20 rounded-lg overflow-hidden">
              <button
                className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 bg-pokeball-gray/5 hover:bg-pokeball-gray/10 focus:outline-none transition-colors"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-pokedex-red mr-1 sm:mr-2" />
                    <span className="font-medium text-sm sm:text-base text-pokedex-black">{rec.name}</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 sm:h-5 sm:w-5 text-pokeball-gray transform transition-transform duration-200 ${expandedId === rec.id ? "rotate-90" : ""}`}
                  />
                </div>
              </button>
              {expandedId === rec.id && (
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-pokedex-white border-t border-pokeball-gray/10">
                  <p className="text-pokedex-black/80 mb-3 text-sm sm:text-base">{rec.description}</p>
                  <div className="bg-pokeball-gray/5 p-2 sm:p-3 rounded-md mb-3">
                    <p className="text-pokedex-black text-xs sm:text-sm">{rec.details}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                    <span
                      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}
                    >
                      {rec.difficulty}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-pokemon-blue/20 text-pokemon-blue">
                      {rec.duration}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-pokeball-red/20 text-pokeball-red">
                      {rec.calories} cal
                    </span>
                  </div>
                  <div className="flex items-center text-xs sm:text-sm text-pokemon-blue mb-3">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-pokemon-yellow" />
                    <span>Complete this workout to catch: {rec.pokemonReward}</span>
                  </div>
                  <button
                    className="w-full mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-pokedex-red text-pokedex-white rounded-md hover:bg-pokeball-red transition-colors text-sm sm:text-base"
                    onClick={(e) => {
                      e.stopPropagation()
                      startWorkout(rec)
                    }}
                    disabled={workout.active}
                  >
                    Start Workout
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

