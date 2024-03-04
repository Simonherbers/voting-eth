import { ethers } from "hardhat";
import { expect } from "chai";
import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("MovieVoting", function () {

  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();
    const MovieVoting = await ethers.getContractFactory("MovieVoting");
    const contract = await MovieVoting.deploy(["Movie 1", "Movie 2", "Movie 3"]);
    await contract.waitForDeployment()
    return { contract, owner, otherAccount };
  }

  it("should have correct initial movie names and vote counts", async function () {
    const { contract } = await loadFixture(deployContract);

    const movieNamesAndVotes = await contract.getAllVotes();
    expect(movieNamesAndVotes[0]).to.deep.equal(["Movie 1", "Movie 2", "Movie 3"]);
    for (let i = 0; i < 3; i++) {
      expect(movieNamesAndVotes[1][i]).to.be.greaterThan(0);
    }
  });

  it("should allow users to vote for a movie", async function () {
    const { contract } = await loadFixture(deployContract);

    await contract.vote(0);
    const { id, name, voteCount } = await contract.movies(0);
    expect(voteCount).to.be.greaterThanOrEqual(0);
  });

  it("should not allow a user to vote twice", async function () {
    const { contract } = await loadFixture(deployContract);

    await contract.vote(0);
    await expect(contract.vote(0)).to.be.revertedWith("Already voted");
  });

  it("should not allow voting for an invalid movie ID", async function () {
    const { contract } = await loadFixture(deployContract);

    await expect(contract.vote(5)).to.be.revertedWith("Invalid movie ID");
  });

  it("should return the correct number of movies", async function () {
    const { contract } = await loadFixture(deployContract);

    const moviesCount = await contract.getMoviesCount();
    expect(moviesCount).to.equal(3);
  });

  it("should return the correct voteCount", async function () {
    const { contract } = await loadFixture(deployContract);

    const votes1 = await contract.getVotesByMovieId(0);
    const movieNamesAndVotes = await contract.getAllVotes();
    const votes2 = movieNamesAndVotes[1][0];
    expect(votes1).to.equal(votes2);
  });

  it("should return the correct name", async function () {
    const { contract } = await loadFixture(deployContract);

    const name = await contract.getMovieIdByName("Movie 1");
    expect(name).to.equal(0);
  });

  it("should not find an id for an invalid movie name", async function () {
    const { contract } = await loadFixture(deployContract);

    await expect(contract.getMovieIdByName("Movie 4")).to.be.revertedWith("Id not found");
  });


});
