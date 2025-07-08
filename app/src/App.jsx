import { React, use, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import Login from "./components/Login.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import { useDebounce } from "react-use";
import { reDeploy } from "./utility/contractHelper.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to avoid too many API calls
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      // const movies = await getTrendingMovies();
      const movies = movieList.filter((movie) => movie.vote_average > 7).slice(0, 10);
      console.log("Trending Movies:", movies);

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);
  
  
  const ArrowIcon = () => (
    <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
      <path
        d="M8 5l8 7-8 7"
        stroke="#bbb"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <main>
      <div className="pattern" />
      <nav className="login">
        <Login />
        <button onClick={() => reDeploy(movieList)} className="reDeploy">
          <ArrowIcon />
        </button>
      </nav>

      <div className="wrapper">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <header>
                  <img src="./hero.png" alt="Hero Banner" />
                  <h1>
                    Find <span className="text-gradient">Movies</span> You'll
                    Enjoy Without The Hassle
                  </h1>
                  <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </header>

                {trendingMovies.length > 0 && (
                  <section className="trending">
                    <h2>Most votes</h2>

                    <ul>
                      {trendingMovies.map((movie, index) => (
                        <li key={movie.$id}>
                          <p>{index + 1}</p>
                          <img src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                              : "no-movie.png"
                          } alt={movie.title} />
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="all-movies">
                  <h2 className="mt-[40px]">All Movies</h2>
                  {isLoading ? (
                    <Spinner />
                  ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                  ) : (
                    <ul>
                      {movieList.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </ul>
                  )}
                </section>
              </div>
            }
          />

          <Route path="/movie/:id" element={<MovieDetail />} />
        </Routes>
      </div>
    </main>
  );
};

export default App;
