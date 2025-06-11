// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    // Movie structure to hold movie details
    struct Movie {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    Movie[] public movies; // Array contains all movies
    mapping(address => bool) public hasVoted; // Mapping to track if an address has voted
    uint256 salt = 25; // Salt for generating random numbers

    // Event to emit when a vote is cast
    event Voted(uint256 movieId);

    // Constructor
    constructor(string[] memory _movieNames) {
        // Add all movie names to the array
        for (uint256 i = 0; i < _movieNames.length; i++) {
            movies.push(Movie(i, _movieNames[i], generateRandomNumber())); // remove random number in production
        }
    }

    // Function to generate a random number based on the salt
    // Note: This is not secure for production use
    function generateRandomNumber() public returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(salt)));
        salt = randomNumber % 100;
        return salt;
    }

    // Vote for a movie by its ID
    function vote(uint256 _movieId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(_movieId < movies.length, "Invalid movie ID");

        movies[_movieId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(_movieId);
    }

    // Returns the amount of movies in the array
    function getMoviesCount() external view returns (uint256) {
        return movies.length;
    }

    // Returns movie names and their vote counts as tuples
    function getAllVotes()
        external
        view
        returns (string[] memory, uint256[] memory)
    {
        string[] memory movieNames = new string[](movies.length);
        uint256[] memory voteCounts = new uint256[](movies.length);
        for (uint256 i = 0; i < movies.length; i++) {
            movieNames[i] = movies[i].name;
            voteCounts[i] = movies[i].voteCount;
        }
        return (movieNames, voteCounts);
    }

    // Returns the votes for a specific movie by its ID
    function getVotesByMovieId(uint256 _id) external view returns (uint256) {
        return movies[_id].voteCount;
    }

    // Returns the movie ID by its name
    function getMovieIdByName(
        string memory _movieName
    ) external view returns (uint256) {
        for (uint256 i = 0; i < movies.length; i++) {
            // Compare lengths first
            if (bytes(movies[i].name).length != bytes(_movieName).length) {
                continue;
            }

            // Compare contents character by character
            bool equal = true;
            for (uint a = 0; a < bytes(_movieName).length; a++) {
                if (bytes(movies[i].name)[a] != bytes(_movieName)[a]) {
                    equal = false;
                    break;
                }
            }
            if (equal) return movies[i].id;
        }
        revert("Id not found");
    }
}
