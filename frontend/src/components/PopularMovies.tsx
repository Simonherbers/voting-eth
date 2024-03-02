// src/components/PopularMovies.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./PopularMovies.css";
import { fetchMovies } from "../utility/MovieService";

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  popularity: number;

  visible: boolean;
}

interface PopularMoviesProps {
  filters: {
    //sortBy: string;
    year: string;
    searchTerm: string;
  };
}
let firstCall = true;

// popularity is a number
const PopularMovies: React.FC<PopularMoviesProps> = ({ filters }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);

  async function fetchData() {
    let movies: Movie[] = await fetchMovies();
    console.log(movies);
    setAllMovies(movies);
  }
  if (firstCall) fetchData();
  firstCall = false;

  useEffect(() => {
    let copy = allMovies;
    for (let i = 0; i < copy.length; i++) {
      // if (
      //   (filters.searchTerm === "" ||
      //     copy[i].title.includes(filters.searchTerm)) &&
      //   (filters.year === "" || copy[i].release_date.endsWith(filters.year))
      // ) {
      //   copy[i].visible = true;
      // } else {
      //   copy[i].visible = false;
      // }
    }
    setMovies(copy);
  }, [filters]);

  const handleMovieClick = (movieId: number) => {
    // Do something when a movie is clicked, e.g., navigate to movie details page
    console.log("Clicked movie with ID:", movieId);
  };

  return (
    <div className="popular-movies-container">
      {movies.map((movie, index) => (
        <div key={`${movie.id}-${index}`}>
          {movie.visible && (
            <div className="container">
              <input type="checkbox" id={`checkbox-${index}`} />
              {/*<label htmlFor={`checkbox-${index}`} className="checkbox-label"></label>*/}
              <Link key={`link-${movie.id}-${index}`} to={`/movie/${movie.id}`}>
                {" "}
                {/* Use Link component to navigate to detail page */}
                <div
                  key={`movie-${movie.id}-${index}`}
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PopularMovies;
