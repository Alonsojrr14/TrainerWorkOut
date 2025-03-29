// Simple mock authentication service
// In a real app, this would connect to a backend API

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  height?: string
  weight?: string
  fitnessGoal?: string
  activityLevel?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// Demo user for testing
const DEMO_USER: User = {
  id: "1",
  name: "Zero",
  email: "john@example.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  bio: "Fitness enthusiast and tech lover. I enjoy running and weightlifting.",
  height: "180",
  weight: "75",
  fitnessGoal: "muscle-gain",
  activityLevel: "active",
}

// Demo credentials (in a real app, NEVER store passwords in frontend code)
const DEMO_CREDENTIALS = {
  email: "john@example.com",
  password: "password123",
}

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false

  const user = localStorage.getItem("fittrack_user")
  return !!user
}

// Get current user
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userJson = localStorage.getItem("fittrack_user")
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as User
  } catch (e) {
    console.error("Failed to parse user from localStorage", e)
    return null
  }
}

// Login
export const login = async (
  credentials: LoginCredentials,
): Promise<{ success: boolean; message?: string; user?: User }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple validation
  if (!credentials.email || !credentials.password) {
    return { success: false, message: "Email and password are required" }
  }

  // Check credentials (in a real app, this would be done on the server)
  if (credentials.email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password) {
    // Store user in localStorage
    localStorage.setItem("fittrack_user", JSON.stringify(DEMO_USER))
    return { success: true, user: DEMO_USER }
  }

  return { success: false, message: "Invalid email or password" }
}

// Register (simplified)
export const register = async (user: { name: string; email: string; password: string }): Promise<{
  success: boolean
  message?: string
  user?: User
}> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simple validation
  if (!user.name || !user.email || !user.password) {
    return { success: false, message: "All fields are required" }
  }

  // In a real app, you would send this data to your API
  // For demo, just return success if email isn't already used
  if (user.email === DEMO_CREDENTIALS.email) {
    return { success: false, message: "Email already in use" }
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    name: user.name,
    email: user.email,
  }

  // Store user in localStorage
  localStorage.setItem("fittrack_user", JSON.stringify(newUser))

  return { success: true, user: newUser }
}

// Logout
export const logout = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("fittrack_user")
}

