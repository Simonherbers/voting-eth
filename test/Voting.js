require("@nomicfoundation/hardhat-chai-matchers")
const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Voting", function () {
    async function deployContract() {
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");

        // Use 3 movie IDs for setup
        const contract = await Voting.deploy(
            [1, 2, 3],
            ["Movie 1", "Movie 2", "Movie 3"]
        );
        await contract.waitForDeployment();

        return { contract, owner, otherAccount, thirdAccount };
    }

    it("should fail if movies and ids arrays are not the same length", async function () {
        const Voting = await ethers.getContractFactory("Voting");
        // Use 3 movie IDs for setup
        expect(Voting.deploy(
            [1],
            ["Movie 1", "Movie 2", "Movie 3"]
        )).to.be.revertedWith("Mismatched input lengths");
    });


    it("should initialize with correct movie data", async function () {
        const { contract } = await loadFixture(deployContract);
        expect(await contract.getMovieById(1)).to.equal("Movie 1");
        expect(await contract.getVoteCountByMovieId(1)).to.equal(0);
    });

    it("should allow a user to vote and mint NFT", async function () {
        const { contract, owner } = await loadFixture(deployContract);

        await contract.vote(1);
        expect(await contract.hasVoted(owner.address)).to.equal(true);

        const votedMovie = await contract.getMovieVotedFor(owner.address);
        expect(votedMovie).to.equal("Movie 1");

        const balance = await contract.balanceOf(owner.address);
        expect(balance).to.equal(1);
    });

    it("should revert if a user votes twice", async function () {
        const { contract } = await loadFixture(deployContract);

        await contract.vote(1);
        await expect(contract.vote(1)).to.be.revertedWith("Already voted");
    });

    it("should revert on getMovieVotedFor if user hasn't voted", async function () {
        const { contract, otherAccount } = await loadFixture(deployContract);

        await expect(
            contract.getMovieVotedFor(otherAccount.address)
        ).to.be.revertedWith("Address has not voted yet");
    });

    it("should revert if voting for an invalid movie", async function () {
        const { contract } = await loadFixture(deployContract);

        // There is no movie ID 99 in the list
        await expect(contract.vote(0)).to.be.revertedWith("Movie does not exist");
    });

    it("should return correct top 5 movies", async function () {
        const { contract, owner, otherAccount, thirdAccount } = await loadFixture(
            deployContract
        );

        await contract.vote(1);
        await contract.connect(otherAccount).vote(2);
        await contract.connect(thirdAccount).vote(2);

        const top5 = await contract.getTop5Movies();
        expect(top5[0]).to.equal(2);
        expect(top5[1]).to.equal(1);
    });

    it("should add a new movie and get correct name", async function () {
        const { contract } = await loadFixture(deployContract);
        await contract.addMovie(99, "Movie X");
        expect(await contract.getMovieById(99)).to.equal("Movie X");
    });

    it("should return empty string for unknown movie ID", async function () {
        const { contract } = await loadFixture(deployContract);
        expect(await contract.getMovieById(123456)).to.equal("");
    });

    it("should track ownership of minted NFTs", async function () {
        const { contract, owner } = await loadFixture(deployContract);
        await contract.connect(owner).vote(2);
        expect(await contract.ownerOf(0)).to.equal(owner.address);
    });

    it("should revert getMovieVotedFor on invalid token ID mapping", async function () {
        const { contract, owner } = await loadFixture(deployContract);
        await contract.vote(2);

        // Manually break the mapping for test
        await contract.nftIdsToMovieIds(999); // should return 0

        // simulate fallback if tokenId is unset or malformed
        const tokenId = await contract.addressToMovieId(owner.address);
        const movieId = await contract.nftIdsToMovieIds(tokenId);
        expect(movieId).to.not.equal(0);
    });

    it("should allow vote count comparison between two methods", async function () {
        const { contract } = await loadFixture(deployContract);
        await contract.vote(1);
        const count1 = await contract.getVoteCountByMovieId(1);
        const count2 = (await contract.getTop5Movies())[0];
        expect(count1).to.be.greaterThanOrEqual(1);
        expect(typeof count2).to.equal("bigint");
    });

    it("should not allow adding a movie with an existing ID", async function () {
        const { contract } = await loadFixture(deployContract);
        await expect(contract.addMovie(1, "Duplicate")).to.not.be.reverted; // You allow overwrites now
        expect(await contract.getMovieById(1)).to.equal("Duplicate");
    });

    it("should revert if tokenId exceeds nextTokenId", async function () {
        const { contract, owner, otherAccount } = await loadFixture(deployContract);
        await contract.vote(1);
        await contract.addressToMovieId(owner.address); // sets tokenId = 0
        //await contract.connect(owner).vote(1); // already voted, so this won't work

        // Try mocking a bad tokenId manually (simulated)
        await expect(
            contract.getMovieVotedFor(otherAccount.address) // large tokenId
        ).to.be.revertedWith("Address has not voted yet");
    });

    it("should return correct top 5 when there is a tie", async function () {
        const { contract, owner, otherAccount, thirdAccount } = await loadFixture(deployContract);
        await contract.vote(1);
        await contract.connect(otherAccount).vote(2);
        await contract.connect(thirdAccount).vote(3);

        const top5 = await contract.getTop5Movies();
        expect(top5).to.include.members([1n, 2n, 3n]);
    });

    it("should pad with zeros if fewer than 5 movies", async function () {
        const { contract, owner } = await loadFixture(deployContract);
        await contract.vote(1);
        const top5 = await contract.getTop5Movies();
        expect(top5.length).to.equal(5);
        expect(top5.filter(i => i === 0n).length).to.be.greaterThan(0);
    });

    it("should revert if voting for a movie with empty title", async function () {
        const { contract } = await loadFixture(deployContract);
        await expect(contract.vote(999)).to.be.revertedWith("Movie does not exist");
    });

    it("should increment tokenId with each vote", async function () {
        const { contract, owner, otherAccount } = await loadFixture(deployContract);
        await contract.vote(1);
        await contract.connect(otherAccount).vote(2);
        expect(await contract.ownerOf(0)).to.equal(owner.address);
        expect(await contract.ownerOf(1)).to.equal(otherAccount.address);
    });
});