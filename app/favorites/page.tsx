'use client';

import { useEffect, useState } from 'react';
import { Pokemon } from '@/app/types/pokemon';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      const pokemonList = await Promise.all(
        favIds.map(async (id: number) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
          return response.json();
        })
      );
      setFavorites(pokemonList);
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Mes Pokémon Favoris</h1>
        <div className="text-center text-gray-600">
          <p className="mb-4">Vous n'avez pas encore de Pokémon favoris.</p>
          <Link href="/" className="text-primary hover:text-primary/80">
            Retourner à la liste des Pokémon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Mes Pokémon Favoris</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((pokemon) => (
          <Link href={`/pokemon/${pokemon.id}`} key={pokemon.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-4">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h2 className="text-xl font-semibold capitalize text-center">
                  {pokemon.name}
                </h2>
                <div className="flex justify-center gap-2 mt-2">
                  {pokemon.types.map((type) => (
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