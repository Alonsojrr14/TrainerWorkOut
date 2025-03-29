"use client"

import type { Pokemon } from "../services/pokeApi"
import { useState } from "react"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

interface PokemonCollectionProps {
  pokemon: Pokemon[]
  loading?: boolean
  pagination?: PaginationProps
  totalPokemon?: number
}

export default function PokemonCollection({
  pokemon,
  loading = false,
  pagination,
  totalPokemon = 0,
}: PokemonCollectionProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

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

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    if (!pagination || pagination.totalPages <= 1) return null

    const { currentPage, totalPages, onPageChange } = pagination

    // Create an array of page numbers to display
    let pages = []

    // Always show first page, last page, current page, and one page before and after current
    const pageBuffer = 1 // How many pages to show before and after current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= currentPage - pageBuffer && i <= currentPage + pageBuffer) // Pages around current
      ) {
        pages.push(i)
      } else if (
        (i === currentPage - pageBuffer - 1 && i > 1) || // Need ellipsis before current range
        (i === currentPage + pageBuffer + 1 && i < totalPages) // Need ellipsis after current range
      ) {
        pages.push(-i) // Negative numbers represent ellipsis positions
      }
    }

    // Remove duplicates and sort
    pages = [...new Set(pages)].sort((a, b) => Math.abs(a) - Math.abs(b))

    return (
      <div className="flex items-center justify-center mt-6 space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1 ? "text-pokeball-gray cursor-not-allowed" : "text-pokedex-black hover:bg-pokeball-gray/10"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page buttons */}
        {pages.map((page, index) => {
          // If page is negative, it's an ellipsis placeholder
          if (page < 0) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-pokeball-gray">
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? "bg-pokemon-blue text-pokedex-white"
                  : "text-pokedex-black hover:bg-pokeball-gray/10"
              }`}
            >
              {page}
            </button>
          )
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? "text-pokeball-gray cursor-not-allowed"
              : "text-pokedex-black hover:bg-pokeball-gray/10"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-pokedex-white p-4 sm:p-6 rounded-lg shadow border border-pokeball-gray/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-pokedex-black">Your Pokémon Collection</h2>
        {totalPokemon > 0 && <span className="text-sm text-pokeball-gray">{totalPokemon} Pokémon caught</span>}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 text-pokemon-blue animate-spin" />
        </div>
      ) : pokemon.length === 0 ? (
        <p className="text-pokeball-gray text-center py-8">
          You haven't caught any Pokémon yet. Complete workouts to catch Pokémon!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {pokemon.map((poke) => (
              <div
                key={poke.id}
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => setSelectedPokemon(poke)}
              >
                <div className="bg-pokeball-gray/10 rounded-lg p-2 flex flex-col items-center">
                  <img
                    src={poke.sprites.front_default || "/placeholder.svg"}
                    alt={poke.name}
                    className="h-16 w-16 sm:h-20 sm:w-20"
                  />
                  <span className="text-xs font-medium text-pokedex-black">#{poke.id}</span>
                  <span className="text-xs sm:text-sm font-semibold truncate w-full text-center text-pokedex-black">
                    {capitalize(poke.name)}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {poke.types.map((typeInfo, index) => (
                      <span
                        key={index}
                        className={`${getTypeColor(typeInfo.type.name)} text-pokedex-white text-xs px-1 py-0.5 rounded`}
                      >
                        {capitalize(typeInfo.type.name).charAt(0)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {renderPaginationButtons()}

          {/* Modal for selected Pokémon */}
          {selectedPokemon && (
            <div className="fixed inset-0 bg-pokemon-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-pokedex-white rounded-lg max-w-md w-full relative max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-2 right-2 text-pokeball-gray hover:text-pokedex-red z-10"
                  onClick={() => setSelectedPokemon(null)}
                >
                  ✕
                </button>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-pokedex-black">
                    {capitalize(selectedPokemon.name)} #{selectedPokemon.id}
                  </h3>

                  <div className="flex justify-center mb-4">
                    <img
                      src={
                        selectedPokemon.sprites.other["official-artwork"].front_default ||
                        selectedPokemon.sprites.front_default ||
                        "/placeholder.svg"
                      }
                      alt={selectedPokemon.name}
                      className="h-32 w-32 sm:h-40 sm:w-40 object-contain"
                    />
                  </div>

                  <div className="flex justify-center gap-2 mb-4">
                    {selectedPokemon.types.map((typeInfo, index) => (
                      <span
                        key={index}
                        className={`${getTypeColor(typeInfo.type.name)} text-pokedex-white text-sm font-medium px-2.5 py-0.5 rounded`}
                      >
                        {capitalize(typeInfo.type.name)}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {selectedPokemon.stats.map((stat, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-xs text-pokeball-gray">
                          {capitalize(stat.stat.name.replace("-", " "))}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-pokeball-gray/20 rounded-full h-2.5">
                            <div
                              className="bg-pokemon-blue h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-pokedex-black">{stat.base_stat}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-pokeball-gray">Height:</span>{" "}
                      <span className="text-pokedex-black">{selectedPokemon.height / 10}m</span>
                    </div>
                    <div>
                      <span className="text-pokeball-gray">Weight:</span>{" "}
                      <span className="text-pokedex-black">{selectedPokemon.weight / 10}kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

