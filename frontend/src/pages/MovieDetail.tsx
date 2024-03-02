// src/pages/MovieDetail.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook
import "./MovieDetail.css";
import { ethers } from "ethers"; // Import ethers
import contractArtifact from "../artifacts/contracts/Voting.sol/MovieVoting.json";

interface MovieDetail {
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve movie ID from URL params
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);

  // Add state to store contract instance
  const [movieVotingContract, setMovieVotingContract] =
    useState<ethers.Contract | null>(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}`,
          {
            params: {
              api_key: "ef1c9eedb88ac226fd038f67c7294250",
              language: "en-US",
            },
          }
        );

        setMovieDetail(response.data);
      } catch (error) {
        console.error("Error fetching movie detail:", error);
      }
    };

    fetchMovieDetail();
  }, [id]); // Fetch movie detail whenever ID changes

  useEffect(() => {
    // Initialize contract instance
    const initContract = async () => {
      try {
        // Replace with your contract address and ABI
        const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
        const contractABI = contractArtifact.abi; // Your contract ABI array
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setMovieVotingContract(contract);
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, []);

  const handleVote = async () => {
    try {
      if (!movieVotingContract) {
        throw new Error("Contract not initialized");
      }
      const movieId = parseInt(id!); // Assuming the movie ID is numeric
      await movieVotingContract.vote(movieId);
      alert("Vote successfully casted!");
    } catch (error) {
      console.error("Error casting vote:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };

  if (!movieDetail) {
    return <div>Loading...</div>;
  }

  const ratingPercentage = (movieDetail.vote_average / 10) * 100;
  const circumference = Math.PI * 80; // 2 * Math.PI * radius
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (ratingPercentage / 100) * circumference;

  let ringColor = "";

  if (movieDetail.vote_average >= 7) {
    ringColor = "#00cc66"; // Green for high ratings
  } else if (movieDetail.vote_average >= 4) {
    ringColor = "#ff9900"; // Orange for moderate ratings
  } else {
    ringColor = "#ff3300"; // Red for low ratings
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-image">
        <img
          src={`https://image.tmdb.org/t/p/w500/${movieDetail.poster_path}`}
          alt={movieDetail.title}
        />
      </div>
      <div className="movie-detail-info">
        <h1>{movieDetail.title}</h1>
        <h3>Rating:</h3>
        <div className="rating-ring">
          <svg>
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              stroke="#ccc"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50%"
              cy="50%"
              r="40%"
              stroke={ringColor}
              strokeWidth="8"
              fill="none"
              style={{
                strokeDasharray,
                strokeDashoffset,
              }}
            />
          </svg>
          <p className="rating">{movieDetail.vote_average}</p>
        </div>
        <div>
          <h3>Release Date:</h3> {movieDetail.release_date}
        </div>
        <div>
          <h3>Description:</h3>
          {movieDetail.overview}
        </div>
        <button onClick={handleVote}>Vote for this movie</button>
      </div>
    </div>
  );
};
export default MovieDetail;
