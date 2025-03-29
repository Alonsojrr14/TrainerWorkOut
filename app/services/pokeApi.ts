// Service to interact with the PokeAPI
export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
    other: {
      "official-artwork": {
        front_default: string
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
  height: number
  weight: number
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    name: string
    url: string
  }[]
}

// Fetch a list of Pokémon
export async function getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)

  if (!response.ok) {
    throw new Error("Failed to fetch Pokémon list")
  }

  return response.json()
}

// Fetch a specific Pokémon by name or ID
export async function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon: ${nameOrId}`)
  }

  return response.json()
}

// Get a random Pokémon (useful for rewards)
export async function getRandomPokemon(): Promise<Pokemon> {
  // There are currently around 1000 Pokémon, but we'll limit to the first 151 (Gen 1)
  const randomId = Math.floor(Math.random() * 151) + 1
  return getPokemon(randomId)
}

