// src/components/PopularMovies.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "./PopularMovies.css";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
}

interface PopularMoviesProps {
  filters: {
    sortBy: string;
    with_keywords: string;
    year: string;
    with_people: string;
    searchTerm: string;
  };
}

const PopularMovies: React.FC<PopularMoviesProps> = ({ filters }) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchMovies = async () => {
    try {
      const totalPages = 5; // Adjust as needed
      let allMovies: any[] = [];

      for (let page = 1; page <= totalPages; page++) {
        const response = await axios.get(
          "https://api.themoviedb.org/3/discover/movie",
          {
            params: {
              api_key: "ef1c9eedb88ac226fd038f67c7294250",
              language: "en-US",
              include_adult: false,
              include_video: false,
              page: page,
              //...(searchTerm && { query: searchTerm }), // Only include query parameter if searchTerm is not empty
              ...filters, // Pass other filters directly
            },
          }
        );

        allMovies = allMovies.concat(response.data.results);
      }

      setMovies(
        allMovies.filter(
          (movie) =>
            filters.searchTerm === "" ||
            movie.title.includes(filters.searchTerm)
        )
      );
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleMovieClick = (movieId: number) => {
    // Do something when a movie is clicked, e.g., navigate to movie details page
    console.log("Clicked movie with ID:", movieId);
  };

  return (
      <div className="popular-movies-container">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}> {/* Use Link component to navigate to detail page */}
            <div
              key={movie.id}
              className="popular-movie"
              onClick={() => handleMovieClick(movie.id)}
            >
              <img
                className="movie-image"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>Year: {movie.release_date}</p>
                <p>Rating: {movie.vote_average}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
  );
};

export default PopularMovies;
