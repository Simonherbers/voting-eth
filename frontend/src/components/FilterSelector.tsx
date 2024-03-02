// src/components/FilterSelector.tsx

import React from "react";

export interface FilterSelectorProps {
  filters: {
    year: string;
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
    <div>
      <label>
        Sort By:
        <select
          name="sortBy"
          value="popularity.desc"
          onChange={handleInputChange}
          disabled
        >
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
        </select>
      </label>
      <label>
        Year:
        <input
          type="text"
          name="year"
          value={filters.year}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Search:
        <input
          type="text"
          placeholder="Search movies"
          name="searchTerm"
          value={filters.searchTerm}
          onChange={handleInputChange}
        />
      </label>
    </div>
  );
};

export default FilterSelector;
