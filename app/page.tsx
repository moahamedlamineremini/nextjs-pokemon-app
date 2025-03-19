'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pokemon } from './types/pokemon';
import { Card } from '@/components/ui/card';
import { Heart, HeartOff } from 'lucide-react';

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { url: string }) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );
        
        setPokemon(pokemonDetails);
        setLoading(false);

        // Charger les favoris depuis le localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const toggleFavorite = (e: React.MouseEvent, pokemonId: number) => {
    e.preventDefault(); // Empêcher la navigation vers la page de détails
    const newFavorites = favorites.includes(pokemonId)
      ? favorites.filter(id => id !== pokemonId)
      : [...favorites, pokemonId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokémon Explorer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemon.map((poke) => (
          <Link href={`/pokemon/${poke.id}`} key={poke.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden relative group">
              <div className="p-4">
                <button
                  onClick={(e) => toggleFavorite(e, poke.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                >
                  {favorites.includes(poke.id) ? (
                    <Heart className="h-5 w-5 text-red-500 fill-current" />
                  ) : (
                    <HeartOff className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                  )}
                </button>
                <img
                  src={poke.sprites.other['official-artwork'].front_default}
                  alt={poke.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h2 className="text-xl font-semibold capitalize text-center">
                  {poke.name}
                </h2>
                <div className="flex justify-center gap-2 mt-2">
                  {poke.types.map((type) => (
                    <span
                      key={type.type.name}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}