import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVoteCountById, voteForMovie } from "../utility/contractHelper.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const [voteCount, setVoteCount] = useState("N/A");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/movie/${id}`, API_OPTIONS);
        if (!res.ok) throw new Error("Failed to fetch movie details.");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
        setError("Could not load movie details.");
      }
    };
    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const count = await getVoteCountById(id);
        setVoteCount(count);
      } catch (err) {
        console.error(err);
      }

    }
    fetchVoteCount();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return <p className="text-white">Loading...</p>;

  return (
    <section className="wrapper space-y-8">
      <Link to="/" className="text-light-100 underline block">
        ← Back to Home
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : "/no-movie.png"
          }
          alt={movie.title}
          className="w-full max-w-[300px] rounded-lg shadow-lg"
        />

        <div className="flex-1 text-white space-y-4">
          <h1 className="text-4xl font-bold">{movie.title}</h1>

          <div className="text-light-200">
            <p className="text-lg">{movie.overview}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-gray-100">
            <p><strong>Language:</strong> {movie.original_language}</p>
            <p><strong>Release Year:</strong> {movie.release_date?.split("-")[0]}</p>
            <p><strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1) || "N/A"}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
          </div>

          <p className="text-light-200">
            <strong>Current Votes: {voteCount}</strong>
          </p>

          <button
            onClick={() => voteForMovie(movie.id)}
            className="bg-light-100/10 hover:bg-light-100/20 text-white px-6 py-3 rounded-full font-bold shadow-md transition"
          >
            Vote
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieDetail;
