import React, {useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import PopularMovies from "./components/PopularMovies";
import FilterSelector from "./components/FilterSelector";

function App() {
  const [filters, setFilters] = useState({
    sortBy: 'popularity.desc',
    with_keywords: '',
    year: '',
    with_people: '',
    searchTerm: '',
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Popular Movies</h1>
      <FilterSelector
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <PopularMovies filters={filters} />
    </div>
  );
}

export default App;
