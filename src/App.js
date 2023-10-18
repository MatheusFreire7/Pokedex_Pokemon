import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PokemonList from './Components/PokemonList';
import PokemonDetail from './Components/PokemonDetail';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Pokedex_Pokemon" element={<PokemonList />} />
        <Route path="/Pokedex_Pokemon/:id" element={<PokemonDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
