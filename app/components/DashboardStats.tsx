import { Activity, Flame, Clock, TrendingUp, Zap } from "lucide-react"

const stats = [
  { name: "Workouts Completed", value: 12, icon: Activity, color: "bg-pokemon-blue" },
  { name: "Calories Burned", value: "3,500", icon: Flame, color: "bg-pokeball-red" },
  { name: "Total Time", value: "8h 30m", icon: Clock, color: "bg-pokedex-green" },
  { name: "Progress", value: "15%", icon: TrendingUp, color: "bg-pokemon-yellow" },
  { name: "Pokémon Caught", value: "0", icon: Zap, color: "bg-pokedex-blue" },
]

export default function DashboardStats() {
  return (
    <>
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-pokedex-white dark:bg-pokemon-black/60 overflow-hidden shadow rounded-lg border border-pokeball-gray/10 dark:border-pokeball-gray/30"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <stat.icon className="h-6 w-6 text-pokedex-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-pokeball-gray truncate">{stat.name}</dt>
                  <dd>
                    <div className="text-lg font-medium text-pokedex-black dark:text-pokedex-white">{stat.value}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

