"use client"

import { useState, useEffect } from "react"
import { getRandomPokemon, getPokemon, type Pokemon } from "../services/pokeApi"
import PokemonCard from "../components/PokemonCard"
import PokemonCollection from "../components/PokemonCollection"
import { Loader2 } from "lucide-react"
import ProtectedRoute from "../components/ProtectedRoute"

// Define a minimal Pokemon type to store in localStorage
interface MinimalPokemon {
  id: number
  name: string
}

export default function PokeFit() {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null)
  const [caughtPokemon, setCaughtPokemon] = useState<Pokemon[]>([])
  const [allPokemonIds, setAllPokemonIds] = useState<MinimalPokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [collectionLoading, setCollectionLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pokemonPerPage = 12

  // Load caught Pokémon IDs from localStorage
  useEffect(() => {
    try {
      const savedPokemonIds = localStorage.getItem("caughtPokemonIds")

      if (savedPokemonIds) {
        const ids: MinimalPokemon[] = JSON.parse(savedPokemonIds)
        setAllPokemonIds(ids)
      }
    } catch (e) {
      console.error("Failed to load caught Pokémon IDs", e)
    }

    fetchRandomPokemon()
  }, [])

  // Fetch Pokémon details for the current page
  useEffect(() => {
    const loadPokemonForCurrentPage = async () => {
      if (allPokemonIds.length === 0) {
        setCollectionLoading(false)
        setCaughtPokemon([])
        return
      }

      setCollectionLoading(true)

      try {
        // Calculate which Pokémon to fetch based on current page
        const startIndex = (currentPage - 1) * pokemonPerPage
        const endIndex = startIndex + pokemonPerPage
        const idsForCurrentPage = allPokemonIds.slice(startIndex, endIndex)

        const pokemonPromises = idsForCurrentPage.map((p) => getPokemon(p.id))
        const pokemonDetails = await Promise.all(pokemonPromises)

        setCaughtPokemon(pokemonDetails)
      } catch (e) {
        console.error("Failed to load Pokémon for current page", e)
      } finally {
        setCollectionLoading(false)
      }
    }

    loadPokemonForCurrentPage()
  }, [allPokemonIds, currentPage])

  // Save only Pokémon IDs to localStorage whenever the caught list changes
  const savePokemonIds = (newIds: MinimalPokemon[]) => {
    try {
      localStorage.setItem("caughtPokemonIds", JSON.stringify(newIds))
    } catch (e) {
      console.error("Failed to save Pokémon IDs to localStorage", e)
      // If we still hit quota issues, limit the number of saved Pokémon
      if (newIds.length > 50) {
        localStorage.setItem("caughtPokemonIds", JSON.stringify(newIds.slice(0, 50)))
        setAllPokemonIds(newIds.slice(0, 50))
      }
    }
  }

  const fetchRandomPokemon = async () => {
    try {
      setLoading(true)
      setError(null)
      const pokemon = await getRandomPokemon()
      setCurrentPokemon(pokemon)
    } catch (err) {
      setError("Failed to fetch a Pokémon. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const catchPokemon = () => {
    if (currentPokemon) {
      // Check if this Pokémon is already caught
      if (!allPokemonIds.some((p) => p.id === currentPokemon.id)) {
        const newPokemon: MinimalPokemon = {
          id: currentPokemon.id,
          name: currentPokemon.name,
        }

        const newIds = [newPokemon, ...allPokemonIds]
        setAllPokemonIds(newIds)
        savePokemonIds(newIds)

        // If we're not on the first page, go to first page to see the new Pokémon
        if (currentPage !== 1) {
          setCurrentPage(1)
        }
      }

      // Get a new Pokémon to catch
      fetchRandomPokemon()
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(allPokemonIds.length / pokemonPerPage)

  // Handle page changes
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">PokéFit Challenge</h1>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Today's Workout Pokémon</h2>
          <p className="mb-4 text-sm sm:text-base">
            Complete your workout today to catch this Pokémon for your collection!
          </p>

          {loading ? (
            <div className="flex justify-center items-center h-40 sm:h-64">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4 text-sm sm:text-base">
              {error}
              <button
                onClick={fetchRandomPokemon}
                className="block mx-auto mt-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm sm:text-base"
              >
                Try Again
              </button>
            </div>
          ) : currentPokemon ? (
            <div className="flex flex-col items-center">
              <PokemonCard pokemon={currentPokemon} />
              <button
                onClick={catchPokemon}
                className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                Complete Workout & Catch Pokémon
              </button>
            </div>
          ) : null}
        </div>

        <PokemonCollection
          pokemon={caughtPokemon}
          loading={collectionLoading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: goToPage,
          }}
          totalPokemon={allPokemonIds.length}
        />
      </div>
    </ProtectedRoute>
  )
}

