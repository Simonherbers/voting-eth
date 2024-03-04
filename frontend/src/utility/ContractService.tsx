import { ethers } from "hardhat";
import { fetchMovies } from "./MovieService";
import contractArtifact from "../artifacts/contracts/Voting.sol/MovieVoting.json";
import { Contract } from "@ethersproject/contracts";

//const provider = new ethers.JsonRpcProvider("http://localhost:8545"); // Example URL for a local node

let contract = null;
let owner = null;
let otherAccount = null;

async function deployContract() {
  try {
    /*
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
    console.log("contractAddress: " + address);*/
    [owner, otherAccount] = await ethers.getSigners();
    const MovieVoting = await ethers.getContractFactory("MovieVoting");
    contract = await MovieVoting.deploy(["Movie 1", "Movie 2", "Movie 3"]);
    await contract.waitForDeployment();
    localStorage.setItem("address", contract.getAddress());

    //localStorage.setItem("owner", owner);
    //localStorage.setItem("otherAccount", otherAccount);
    //return {contract, owner, otherAccount};
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
}

export async function getContract() {
  let deployed = localStorage.getItem("address");
  if (deployed === null) {
    await deployContract();
  }

  return contract!;
}
export async function getOwner() {
  let deployed = localStorage.getItem("address");
  if (deployed === null) {
    await deployContract();
  }

  return owner!;
}
/*
export async function getOtherAccount() {
  let deployed = localStorage.getItem("address");
  if (deployed === null) {
    await deployContract();
  }

  return otherAccount!;
}
*/
