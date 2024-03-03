// ConfigurationPage.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "../artifacts/contracts/Voting.sol/MovieVoting.json";
import NavigationHeader from "../components/NavigationHeader";
import { deployContract, getContract } from "../utility/ContractService";

const ConfigurationPage = () => {
  const [movieNames, setMovieNames] = useState<string[]>([]);
  const [newMovieName, setNewMovieName] = useState("");
  const [movieVotes, setMovieVotes] = useState<
    { name: string; voteCount: number }[]
  >([]);

  useEffect(() => {
    const fetchMovieVotes = async () => {
      try {
        const contract = await getContract();
        let count = await contract.getMoviesCount();
        const proxy = await contract.getAllVotes(); // Assuming getAllVotes returns (string[], uint256[])
        const movieNames = proxy[0];
        const movieVoteCounts = proxy[1];

        // Merge the lists into a single list
        let list = [];
        for (let i = 0; i < movieNames.length; i++) {
          list.push({ name: movieNames[i], voteCount: movieVoteCounts[i] });
        }

        setMovieVotes(list);
      } catch (error) {
        console.error("Error fetching movie votes:", error);
      }
    };
    fetchMovieVotes();
  }, []); // Fetch movie votes on component mount

  return (
    <div>
      <NavigationHeader />
      <h2>Movie Votes</h2>
      <ul>
        {movieVotes.map((movie, index) => (
          <li key={index}>
            {movie.name} - Votes: {movie.voteCount}
          </li>
        ))}
      </ul>
      {/* <h1>Configuration Page</h1>
      <div className="movie-list-container">
      <h2>List of Movies</h2>
      <ul className="movie-list">
        {movieNames.map((movieName, index) => (
          <li key={index}>{movieName}</li>
        ))}
      </ul>
      <div className="add-movie-container">
        <input
          type="text"
          value={newMovieName}
          onChange={(e) => setNewMovieName(e.target.value)}
          placeholder="Enter movie name"
        />
        <button onClick={handleAddMovie}>Add Movie</button>
      </div>
    </div> */}
    </div>
  );
};

export default ConfigurationPage;
