// src/components/FilterSelector.tsx

import React from "react";
import './FilterSelector.css'; // Import CSS file for styling

interface FilterSelectorProps {
  filters: {
    sortBy: string;
    with_keywords: string;
    year: string;
    with_people: string;
    searchTerm: string;
  };
  onFilterChange: (name: string, value: string) => void;
}
const FilterSelector: React.FC<FilterSelectorProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };
  return (
    <div className="form-container">
      <div className="form-row">
        <label>Sort By:</label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleInputChange}
        >
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
        </select>
      </div>
      <div className="form-row">
        <label>Keywords:</label>
        <input
          type="text"
          name="with_keywords"
          value={filters.with_keywords}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <label>Year:</label>
        <input
          type="text"
          name="year"
          value={filters.year}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <label>People:</label>
        <input
          type="text"
          name="with_people"
          value={filters.with_people}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-row">
        <label>Search:</label>
        <input
          type="text"
          placeholder="Search movies"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default FilterSelector;
