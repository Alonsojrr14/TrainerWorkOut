import type { Pokemon } from "../services/pokeApi"

interface PokemonCardProps {
  pokemon: Pokemon
  showStats?: boolean
}

export default function PokemonCard({ pokemon, showStats = true }: PokemonCardProps) {
  // Helper function to capitalize first letter
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  // Get the type color
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      normal: "bg-pokeball-gray",
      fire: "bg-pokeball-red",
      water: "bg-pokemon-blue",
      electric: "bg-pokemon-yellow",
      grass: "bg-pokedex-green",
      ice: "bg-pokedex-blue",
      fighting: "bg-pokeball-red",
      poison: "bg-pokedex-red",
      ground: "bg-pokemon-yellow/80",
      flying: "bg-pokemon-blue/70",
      psychic: "bg-pokedex-red/80",
      bug: "bg-pokedex-green/80",
      rock: "bg-pokeball-gray/80",
      ghost: "bg-pokemon-blue/90",
      dragon: "bg-pokemon-blue/80",
      dark: "bg-pokemon-black",
      steel: "bg-pokeball-gray/70",
      fairy: "bg-pokedex-red/70",
    }

    return typeColors[type] || "bg-pokeball-gray"
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-pokedex-white rounded-lg shadow-md overflow-hidden border border-pokeball-gray/20">
      <div className="p-3 sm:p-4 bg-pokeball-gray/5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-pokedex-black">{capitalize(pokemon.name)}</h3>
          <span className="text-pokeball-gray font-medium">#{pokemon.id}</span>
        </div>

        <div className="flex gap-2 mb-2">
          {pokemon.types.map((typeInfo, index) => (
            <span
              key={index}
              className={`${getTypeColor(typeInfo.type.name)} text-pokedex-white text-xs font-medium px-2 py-0.5 rounded`}
            >
              {capitalize(typeInfo.type.name)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center p-3 sm:p-4 bg-pokemon-yellow/5">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="h-32 w-32 sm:h-48 sm:w-48 object-contain"
        />
      </div>

      {showStats && (
        <div className="p-3 sm:p-4">
          <h4 className="font-semibold text-pokedex-black mb-2">Stats</h4>
          <div className="grid grid-cols-2 gap-2">
            {pokemon.stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-xs text-pokeball-gray">{capitalize(stat.stat.name.replace("-", " "))}</span>
                <div className="w-full bg-pokeball-gray/20 rounded-full h-2.5">
                  <div
                    className="bg-pokemon-blue h-2.5 rounded-full"
                    style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-pokeball-gray">Height:</span> {pokemon.height / 10}m
            </div>
            <div>
              <span className="text-pokeball-gray">Weight:</span> {pokemon.weight / 10}kg
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

