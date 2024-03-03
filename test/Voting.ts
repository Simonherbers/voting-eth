import { ethers } from "ethers";
import { expect } from "chai";
import { Contract } from "ethers";
import contractArtifact from "../frontend/src/artifacts/contracts/Voting.sol/MovieVoting.json";

describe("MovieVoting", function () {
  let MovieVoting: Contract;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let contract: Contract;

  beforeEach(async function () {
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const signer = await provider.getSigner();

    // es getSigners() -> user und owner 

    
    const MovieVotingFactory = await new ethers.ContractFactory(contractArtifact.abi, contractArtifact.bytecode, signer);
    let MovieVoting = await MovieVotingFactory.deploy(["Movie 1", "Movie 2", "Movie 3"]);
    await MovieVoting.waitForDeployment();
    
    contract = new ethers.Contract(
        await MovieVoting.getAddress(),
        contractArtifact.abi,
        provider
      );
  });

  it("should have correct initial movie names and vote counts", async function () {
    const movieNames = await contract.getAllVotes();
    expect(movieNames[0]).to.deep.equal(["Movie 1", "Movie 2", "Movie 3"]);
    expect(movieNames[1]).to.deep.equal([0, 0, 0]);
  });

  it("should allow users to vote for a movie", async function () {
    await contract.connect(user).vote(0);
    const voteCount = await MovieVoting.movies(0);
    expect(voteCount).to.equal(1);
  });

  it("should not allow a user to vote twice", async function () {
    await contract.vote(0);
    //await expect(MovieVoting.connect(user).vote(0)).to.be.revertedWith("Already voted");
    await expect(contract.vote(0)).to.be.revertedWith("Already voted");
  });

  it("should not allow voting for an invalid movie ID", async function () {
    await expect(contract.vote(5)).to.be.revertedWith("Invalid movie ID");
  });

  it("should return the correct number of movies", async function () {
    const moviesCount = await contract.getMoviesCount();
    expect(moviesCount).to.equal(3);
  });
});
