// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// ERC 20 permit
contract Voting is ERC721 {
    // Mapping from tokenId (NFT) to movie name
    mapping(uint256 => string) public movieNames;
    // Mapping from tokenId (NFT) to vote count
    mapping(uint256 => uint256) public voteCounts;
    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;
    // Salt for generating random numbers (not secure, for demo only)
    uint256 salt = 25;
    // Counter for NFT tokenIds
    uint256 public nextTokenId;

    // Event to emit when a vote is cast
    event Voted(uint256 movieId);

    // Constructor
    constructor(string[] memory _movieNames) ERC721("VotingNFT", "VOTE") {
        for (uint256 i = 0; i < _movieNames.length; i++) {
            uint256 tokenId = nextTokenId;
            _mint(address(this), tokenId);
            movieNames[tokenId] = _movieNames[i];
            voteCounts[tokenId] = generateRandomNumber(); // remove random number in production
            nextTokenId++;
        }
    }

    // Function to add a new movie
    function addMovie(string memory _name) external {
        uint256 tokenId = nextTokenId;
        _mint(address(this), tokenId);
        movieNames[tokenId] = _name;
        voteCounts[tokenId] = generateRandomNumber(); // remove random number in production
        nextTokenId++;
    }

    // Function to generate a random number based on the salt
    // Note: This is not secure for production use
    function generateRandomNumber() public returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(salt)));
        salt = randomNumber % 100;
        return salt;
    }

    // Vote for a movie by its NFT ID
    function vote(uint256 _movieId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(ownerOf(_movieId) == address(this), "Invalid movie ID");
        voteCounts[_movieId]++;
        hasVoted[msg.sender] = true;

        emit Voted(_movieId);
    }

    /**
     * @notice Returns the total number of movies available.
     * @dev This function provides the current number of NFTs minted.
     * @return The number of movies stored in the contract.
     */
    function getMoviesCount() external view returns (uint256) {
        return nextTokenId;
    }

    // Returns movie names and their vote counts as tuples
    function getAllVotes()
        external
        view
        returns (string[] memory, uint256[] memory)
    {
        string[] memory names = new string[](nextTokenId);
        uint256[] memory votes = new uint256[](nextTokenId);
        for (uint256 i = 0; i < nextTokenId; i++) {
            names[i] = movieNames[i];
            votes[i] = voteCounts[i];
        }
        return (names, votes);
    }

    // Returns the votes for a specific movie by its NFT ID
    function getVotesByMovieId(uint256 _id) external view returns (uint256) {
        require(_id < nextTokenId, "Invalid movie ID");
        return voteCounts[_id];
    }

    // Returns the movie ID by its name
    function getMovieIdByName(
        string memory _movieName
    ) external view returns (uint256) {
        for (uint256 i = 0; i < nextTokenId; i++) {
            // Compare lengths first
            if (bytes(movieNames[i]).length != bytes(_movieName).length) {
                continue;
            }
            // Compare contents character by character
            bool equal = true;
            for (uint a = 0; a < bytes(_movieName).length; a++) {
                if (bytes(movieNames[i])[a] != bytes(_movieName)[a]) {
                    equal = false;
                    break;
                }
            }
            if (equal) return i;
        }
        revert("Id not found");
    }
}
