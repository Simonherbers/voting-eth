// scripts/deploy.ts
import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MovieVoting = await ethers.getContractFactory("MovieVoting");
  const movieNames = ["Movie 1", "Movie 2", "Movie 3"]; // Add your movie names here
  const deploymentTx = await MovieVoting.deploy(movieNames);

  // Access the deployed contract's address directly from the deployment transaction
  const deployedContractAddress = await deploymentTx.getAddress();

  console.log("MovieVoting deployed to:", deployedContractAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
