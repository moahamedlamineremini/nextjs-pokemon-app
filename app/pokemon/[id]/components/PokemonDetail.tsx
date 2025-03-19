'use client';

import { useState, useEffect } from 'react';
import { Pokemon } from '@/app/types/pokemon';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, HeartOff } from 'lucide-react';
import Link from 'next/link';

export default function PokemonDetail({ pokemon }: { pokemon: Pokemon }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Vérifier si le Pokémon est dans les favoris
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(pokemon.id));
  }, [pokemon.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((id: number) => id !== pokemon.id);
    } else {
      newFavorites = [...favorites, pokemon.id];
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la liste
        </Link>
        <button
          onClick={toggleFavorite}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {isFavorite ? (
            <>
              <HeartOff className="h-4 w-4" />
              Retirer des favoris
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              Ajouter aux favoris
            </>
          )}
        </button>
      </div>
      
      <Card className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="flex flex-col items-center">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className="w-full max-w-md"
            />
            <h1 className="text-3xl font-bold capitalize mt-4">{pokemon.name}</h1>
            <div className="flex gap-2 mt-2">
              {pokemon.types.map((type) => (
                <span
                  key={type.type.name}
                  className="px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Statistiques</h2>
              <div className="space-y-2">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="capitalize">{stat.stat.name}</span>
                      <span>{stat.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Détails</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Taille</p>
                  <p className="font-medium">{pokemon.height / 10}m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Poids</p>
                  <p className="font-medium">{pokemon.weight / 10}kg</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Capacités</h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((ability) => (
                  <span
                    key={ability.ability.name}
                    className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground"
                  >
                    {ability.ability.name.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}