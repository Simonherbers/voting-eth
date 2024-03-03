import { ethers } from "ethers";
import { fetchMovies } from "./MovieService";
import contractArtifact from "../artifacts/contracts/Voting.sol/MovieVoting.json";

const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Example URL for a local node

export async function deployContract() {
  try {
    // Split movie names input into an array
    const movies = await fetchMovies();
    const movieNamesArray = movies.map((obj) => obj.title);

    // Connect to Ethereum network

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
    const address = await deployedContract.getAddress();
    localStorage.setItem("contractAddress", address);
    console.log("contractAddress: " + address);
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

export async function getContract() {
  let contractAddress = localStorage.getItem("contractAddress");
  if (contractAddress === null) {
    await deployContract();
    contractAddress = localStorage.getItem("contractAddress");
  }

  const contract = new ethers.Contract(
    contractAddress!,
    contractArtifact.abi,
    provider
  );
  return contract;
}
