"use client"

import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { useTheme } from "../contexts/ThemeContext"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function WorkoutProgress() {
  const { theme } = useTheme()
  const [chartOptions, setChartOptions] = useState({})
  const [data] = useState({
    labels,
    datasets: [
      {
        label: "Workout Duration (minutes)",
        data: labels.map(() => Math.floor(Math.random() * 60) + 30),
        backgroundColor: "#3466AF", // pokemon-blue
      },
    ],
  })

  useEffect(() => {
    // Update chart options based on theme
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: theme === "dark" ? "#FFFFFF" : "#222222",
          },
        },
        title: {
          display: true,
          text: "Weekly Workout Progress",
          color: theme === "dark" ? "#FFFFFF" : "#222222",
        },
      },
      scales: {
        x: {
          ticks: {
            color: theme === "dark" ? "#FFFFFF" : "#222222",
          },
          grid: {
            color: theme === "dark" ? "rgba(160, 160, 160, 0.2)" : "rgba(160, 160, 160, 0.3)",
          },
        },
        y: {
          ticks: {
            color: theme === "dark" ? "#FFFFFF" : "#222222",
          },
          grid: {
            color: theme === "dark" ? "rgba(160, 160, 160, 0.2)" : "rgba(160, 160, 160, 0.3)",
          },
        },
      },
    })
  }, [theme])

  return (
    <div className="bg-pokedex-white dark:bg-pokemon-black/60 p-6 rounded-lg shadow border border-pokeball-gray/10 dark:border-pokeball-gray/30">
      <h2 className="text-xl font-semibold mb-4 text-pokedex-black dark:text-pokedex-white">Workout Progress</h2>
      <Bar options={chartOptions} data={data} />
    </div>
  )
}

