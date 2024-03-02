// ConfigurationPage.jsx
import React, { useState } from "react";
import { ethers } from "ethers";
import contractArtifact from "../artifacts/contracts/Voting.sol/MovieVoting.json";
import NavigationHeader from "../components/NavigationHeader";

const ConfigurationPage = () => {
  const [deployedContractAddress, setDeployedContractAddress] = useState("");
  const [movieNames, setMovieNames] = useState<string[]>([]);
  const [newMovieName, setNewMovieName] = useState('');

  const handleDeployContract = async () => {
    try {
      // Split movie names input into an array
      const movieNamesArray = movieNames;

      // Connect to Ethereum network
      const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Example URL for a local node

      // Get signer (account) from provider
      const signer = await provider.getSigner();

      // Load contract factory
      const contractFactory = new ethers.ContractFactory(
        // ABI of the contract (you need to replace this with your contract's ABI)
        contractArtifact.abi, // Example ABI with a constructor that takes an array of strings
        // Bytecode of the contract (you need to replace this with your contract's bytecode)
        contractArtifact.bytecode, // Example bytecode of a simple contract
        // Signer (account) to deploy the contract
        signer
      );

      // Deploy contract
      const deployedContract = await contractFactory.deploy(movieNamesArray);

      // Wait for deployment transaction to be mined
      await deployedContract.waitForDeployment();

      // Set deployed contract address
      setDeployedContractAddress(await deployedContract.getAddress());
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
}


const handleAddMovie = () => {
    if (newMovieName.trim() !== '') {
        setMovieNames([...movieNames, newMovieName]);
        setNewMovieName('');
    }
  };

  return (
    <div>
      <NavigationHeader />
      <h1>Configuration Page</h1>
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
    </div>
    </div>
  );
};

export default ConfigurationPage;
