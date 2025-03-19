import { Pokemon } from '@/app/types/pokemon';
import PokemonDetail from './components/PokemonDetail';

// Cette fonction s'exécute côté serveur
export async function generateStaticParams() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await response.json();
  
  return data.results.map((_: any, index: number) => ({
    id: String(index + 1),
  }));
}

// Fonction pour récupérer les données du Pokémon côté serveur
async function getPokemon(id: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response.json();
}

// Page serveur qui appelle le composant client
export default async function PokemonPage({ params }: { params: { id: string } }) {
  const pokemon = await getPokemon(params.id);
  return <PokemonDetail pokemon={pokemon} />;
}