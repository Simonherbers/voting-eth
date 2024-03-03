// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MovieVoting {
    struct Movie {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    Movie[] public movies;
    mapping(address => bool) public hasVoted;

    event Voted(uint256 movieId);

    constructor(string[] memory _movieNames) {
        for (uint256 i = 0; i < _movieNames.length; i++) {
            movies.push(Movie(i, _movieNames[i], 0));
        }
    }

    function vote(uint256 _movieId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(_movieId < movies.length, "Invalid movie ID");

        movies[_movieId].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(_movieId);
    }

    function getMoviesCount() external view returns (uint256) {
        return movies.length;
    }

    function getAllVotes() external view returns (string[] memory, uint256[] memory) {
        string[] memory movieNames = new string[](movies.length);
        uint256[] memory voteCounts = new uint256[](movies.length);
        for (uint256 i = 0; i < movies.length; i++) {
            movieNames[i] = movies[i].name;
            voteCounts[i] = movies[i].voteCount;
        }
        return (movieNames, voteCounts);
    }
}
