import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PokemonDetail.css';

const EvolutionInfo = ({ evolution }) => (
  <div className="evolution-info">
    <img src={evolution.img} alt={evolution.name} />
    <p>{evolution.name} ({evolution.num})</p>
  </div>
);

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [showEvolution, setShowEvolution] = useState(false);
  const [evolutionDetails, setEvolutionDetails] = useState([]);

  useEffect(() => {
    // Recupere os detalhes do Pokémon com base no ID da rota
    fetch('/data/Pokedex151.json', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // O JSON fornecido é um objeto com uma propriedade 'pokemon'
        // Acesse essa propriedade para obter a matriz de Pokémon
        const pokemonArray = data.pokemon;

        // Encontre o Pokémon com o ID correspondente
        const selectedPokemon = pokemonArray.find((p) => p.id.toString() === id);

        if (selectedPokemon) {
          setPokemon(selectedPokemon);
          fetchEvolutionDetails(data.pokemon, selectedPokemon);
        } else {
          // Lida com o caso em que o Pokémon não é encontrado
          console.error('Pokémon não encontrado.');
        }
      })
      .catch((error) => {
        console.error('Erro ao recuperar dados:', error);
      });
  }, [id]);

  const fetchEvolutionDetails = (pokemonArray, selectedPokemon) => {
    const evolutionArray = [];
    const { prev_evolution, next_evolution } = selectedPokemon;

    if (prev_evolution) {
      prev_evolution.forEach((evo) => {
        const prevEvoData = pokemonArray.find((p) => p.num === evo.num);
        if (prevEvoData) {
          evolutionArray.push(prevEvoData);
        }
      });
    }

    evolutionArray.push(selectedPokemon);

    if (next_evolution) {
      next_evolution.forEach((evo) => {
        const nextEvoData = pokemonArray.find((p) => p.num === evo.num);
        if (nextEvoData) {
          evolutionArray.push(nextEvoData);
        }
      });
    }

    setEvolutionDetails(evolutionArray);
  };

  const toggleEvolution = () => {
    setShowEvolution(!showEvolution);
  };

  return (
    <div className="pokemon-detail">
      {pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.img} alt={pokemon.name} className="pokemon-image" />
          <div className="pokemon-info">
            <p>Tipo: {pokemon.type.join(', ')}</p>
            <p>Altura: {pokemon.height}</p>
            <p>Peso: {pokemon.weight}</p>
            <p>Doce: {pokemon.candy}</p>
            <p>Contador de Doces: {pokemon.candy_count}</p>
            <p>Quantidade de KM para Chocar o Ovo: {pokemon.egg}</p>
            <p>Chance de Spaw: {pokemon.spawn_chance}</p>
            <p>Média de Spawn: {pokemon.avg_spawns}</p>
            <p>Tempo de Spaw: {pokemon.spawn_time}</p>
            <p>Fraquezas: {pokemon.weaknesses.join(', ')}</p>
          </div>
          {evolutionDetails.length > 1 && (
            <div>
              <button onClick={toggleEvolution}>
                {showEvolution ? 'Esconder Linha Evolutiva' : 'Mostrar Linha Evolutiva'}
              </button>
              {showEvolution && (
                <div>
                  <p>Evolutions:</p>
                  <div className="evolution-container">
                    {evolutionDetails.map((evo) => (
                      <EvolutionInfo key={evo.num} evolution={evo} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="back-button-container">
            <button onClick={() => window.history.back()} className="back-button">
              Voltar para a Lista
            </button>
          </div>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
};

export default PokemonDetail;