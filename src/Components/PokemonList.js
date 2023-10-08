import React, { useEffect, useState } from 'react';
import './PokemonList.css';
import { Link } from 'react-router-dom';
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineClear  } from 'react-icons/ai'; 

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortByWeight, setSortByWeight] = useState(null); 
  const [sortByHeight, setSortByHeight] = useState(null); 

  useEffect(() => {
    fetch('/data/Pokedex151.json', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setPokemonList(data.pokemon));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const toggleSortByWeight = () => {
    setSortByWeight(!sortByWeight);
    setSortByHeight(null); // Certifique-se de que apenas uma opção de ordenação está ativada de cada vez
  };

  const toggleSortByHeight = () => {
    setSortByHeight(!sortByHeight);
    setSortByWeight(null); // Certifique-se de que apenas uma opção de ordenação está ativada de cada vez
  };

  const resetSorting = () => {
    setSortByWeight(null);
    setSortByHeight(null);
  };

  const sortedPokemon = [...pokemonList]; // Crie uma cópia da lista de Pokémon para não alterar a original

  if (sortByWeight !== null) {
    sortedPokemon.sort((a, b) => {
      const weightA = parseFloat(a.weight);
      const weightB = parseFloat(b.weight);
      return sortByWeight ? weightA - weightB : weightB - weightA;
    });
  } else if (sortByHeight !== null) {
    sortedPokemon.sort((a, b) => {
      const heightA = parseFloat(a.height);
      const heightB = parseFloat(b.height);
      return sortByHeight ? heightA - heightB : heightB - heightA;
    });
  } else {
    sortedPokemon.sort((a, b) => parseInt(a.id) - parseInt(b.id)); // Ordenar por ID por padrão
  }
  
  const filteredPokemon = sortedPokemon.filter((pokemon) => {
    const nameMatch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = !typeFilter || pokemon.type.includes(typeFilter);

    return nameMatch && typeMatch;
  });

  return (
    <div className="pokemon-list-container">
      <h1 className="pokemon-list-title">Lista dos 151 Pokémons Originais</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select value={typeFilter} onChange={handleTypeFilterChange}>
          <option value="">Filtrar por tipo</option>
          <option value="Grass">Grass</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Poison">Poison</option>
          <option value="Flying">Flying</option>
          <option value="Bug">Bug</option>
          <option value="Ghost">Ghost</option>
          <option value="Normal">Normal</option>
          <option value="Ground">Ground</option>
          <option value="Fighting">Fighting</option>
          <option value="Psychic">Psychic</option>
          <option value="Eletric">Eletric</option>
          <option value="Ice">Ice</option>
          <option value="Rock">Rock</option>
          <option value="Dragon">Dragon</option>
        </select>
        <div className="sort-buttons">
          <button onClick={toggleSortByWeight}>
            Ordenar por Peso <span>{sortByWeight ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}</span>
          </button>
          <button onClick={toggleSortByHeight}>
            Ordenar por Altura <span>{sortByHeight ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}</span>
          </button>
          <button onClick={resetSorting}>
            Resetar <span><AiOutlineClear /></span>
          </button>
        </div>
      </div>

      <div className="pokemon-grid">
        {filteredPokemon.map((pokemon) => (
          <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className="pokemon-card">
            <img src={pokemon.img} alt={pokemon.name} />
            <p>{pokemon.name}</p>
            <p>Tipo: {pokemon.type.join(', ')}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PokemonList;
