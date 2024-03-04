// ConfigurationPage.jsx
import React, { useEffect, useState } from "react";
import NavigationHeader from "../components/NavigationHeader";
import { getContract } from "../utility/ContractService";
import "./ContractDeploymentPage.css";
import { Link } from "react-router-dom";

const ConfigurationPage = () => {
  //const [movieNames, setMovieNames] = useState<string[]>([]);
  //const [newMovieName, setNewMovieName] = useState("");
  const [movieVotes, setMovieVotes] = useState<
    { name: string; voteCount: string}[]
  >([]);

  const fetchMovieVotes = async () => {
    try {
      const contract = (await getContract() as any);
      //let count = await contract.getMoviesCount();
      const proxy = await contract.getAllVotes(); // Assuming getAllVotes returns (string[], uint256[])
      const movieNames = await proxy[0];
      const movieVoteCounts = await proxy[1];

      // Merge the lists into a single list
      let list = [];
      for (let i = 0; i < movieNames.length; i++) {
        //const movieApiId: string = await getMovieIdByName(movieNames[i]);
        list.push({ name: movieNames[i], voteCount: movieVoteCounts[i].toString()});
      }

      list.sort((a, b) => parseInt(b.voteCount) - parseInt(a.voteCount))
      setMovieVotes(list);
    } catch (error) {
      console.error("Error fetching movie votes:", error);
    }
  };




  useEffect(() => {
    fetchMovieVotes();

    // Set interval to fetch data periodically (e.g., every 5 seconds)
    const intervalId = setInterval(fetchMovieVotes, 2000);

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Fetch movie votes on component mount
  
  return (
    <div>
      <NavigationHeader />
      <h2>Movie Votes</h2>
      <ul id="ranking">
        {movieVotes.map((movie, index) => (
            <li key={index}>
              {movie.name} - Votes: <span>{movie.voteCount}</span>
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
