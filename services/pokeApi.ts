
import { Pokemon } from '../types';

export async function fetchPokemons(): Promise<Pokemon[]> {
  const ids = [1, 4, 7, 25, 39, 52, 94, 133, 143, 150]; // Iconic pokemons
  const pokemons: Pokemon[] = [];

  for (const id of ids) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await response.json();
      pokemons.push({
        id: data.id,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprite: data.sprites.other.showdown.front_default || data.sprites.front_default
      });
    } catch (error) {
      console.error("Error fetching pokemon", error);
    }
  }

  return pokemons;
}

export async function searchPokemon(name: string): Promise<Pokemon | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      sprite: data.sprites.other.showdown.front_default || data.sprites.front_default
    };
  } catch (error) {
    return null;
  }
}
