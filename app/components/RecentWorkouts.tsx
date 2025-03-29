import { Calendar } from "lucide-react"

const workouts = [
  { id: 1, name: "Full Body Workout", date: "2023-06-01", duration: "45 min" },
  { id: 2, name: "Upper Body Strength", date: "2023-05-30", duration: "60 min" },
  { id: 3, name: "HIIT Cardio", date: "2023-05-28", duration: "30 min" },
  { id: 4, name: "Leg Day", date: "2023-05-26", duration: "50 min" },
]

export default function RecentWorkouts() {
  return (
    <div className="bg-pokedex-white dark:bg-pokemon-black/60 p-6 rounded-lg shadow border border-pokeball-gray/10 dark:border-pokeball-gray/30">
      <h2 className="text-xl font-semibold mb-4 text-pokedex-black dark:text-pokedex-white">Recent Workouts</h2>
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-pokeball-gray/20 dark:divide-pokeball-gray/10">
          {workouts.map((workout) => (
            <li key={workout.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-pokemon-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-pokedex-black dark:text-pokedex-white truncate">
                    {workout.name}
                  </p>
                  <p className="text-sm text-pokeball-gray">{workout.date}</p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pokedex-green/20 text-pokedex-green dark:bg-pokedex-green/30 dark:text-pokedex-white">
                    {workout.duration}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a
          href="#"
          className="w-full flex justify-center items-center px-4 py-2 border border-pokeball-gray/30 shadow-sm text-sm font-medium rounded-md text-pokedex-black dark:text-pokedex-white bg-pokedex-white dark:bg-pokemon-black/40 hover:bg-pokeball-gray/5 dark:hover:bg-pokeball-gray/20"
        >
          View all workouts
        </a>
      </div>
    </div>
  )
}

