import Link from "next/link"
import { Home, Dumbbell, Zap } from "lucide-react"

const menuItems = [
  { icon: Home, text: "Dashboard", href: "/dashboard" },
  { icon: Zap, text: "PokéFitDex", href: "/dashboard/pokefit" },
]

export default function Sidebar() {
  return (
    <div className="sidebar bg-pokedex-red text-pokedex-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 dark:bg-pokemon-black">
      <Link href="/dashboard" className="text-pokedex-white flex items-center space-x-2 px-4">
        <Dumbbell className="w-8 h-8" />
        <span className="text-2xl font-extrabold">TrainerWorkOut</span>
      </Link>
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-pokeball-red hover:text-pokedex-yellow dark:hover:bg-pokemon-blue/80"
          >
            <item.icon className="inline-block w-6 h-6 mr-2 -mt-1" />
            {item.text}
          </Link>
        ))}
      </nav>
    </div>
  )
}

