import { React, use, useEffect, useState } from "react";
import { Routes, Route, Link} from "react-router-dom";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import Login from "./components/Login.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import { useDebounce } from "react-use";
import { getTop5Movies, reDeploy } from "./utility/contractHelper.jsx";

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
      const top5 = await getTop5Movies();
      
      if (
        !top5 ||
        top5.length === 0
      ) {
        const response = await fetch(`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`, API_OPTIONS);
        if (!response.ok) {
          throw new Error("Failed to fetch trending movies");
        }
        const data = await response.json();
        const l = data.results || [];
        setTrendingMovies(l.slice(0, 5));
        return;
      }

      if (top5.some((movie) => movie.id === 0n))
{
        const response = await fetch(`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`, API_OPTIONS);
        if (!response.ok) {
          throw new Error("Failed to fetch trending movies");
        }
        const data = await response.json();
        const l = data.results || [];
        const random_index = Math.floor(Math.random() * (l.length-5));
        for (let i = 0; i < top5.length; i++) {
          if (top5[i].id === 0n) {
            top5[i].id = l[random_index + i].id;
            top5[i].votes = 0;
          }
        }
      }

      const movieDetails = await Promise.all(
        top5.map(async (result) => {
          const res = await fetch(`${API_BASE_URL}/movie/${result.id}`, API_OPTIONS);
          if (!res.ok) throw new Error("Failed to fetch movie details");
          let movie = res.json();
          movie.votes = result.votes;
          return movie;
        })
      );
      setTrendingMovies(movieDetails);
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
                        <li key={movie.id}>
                          <p>{index + 1}</p>
                          <Link to={`/movie/${movie.id}`}>
                            <img
                              src={
                                movie.poster_path
                                  ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                                  : "no-movie.png"
                              }
                              alt={movie.title}
                            />
                          </Link>
                          <span>{movie.votes}</span>
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
