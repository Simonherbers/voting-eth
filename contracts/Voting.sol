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
    uint256 salt = 25;

    event Voted(uint256 movieId);

    constructor(string[] memory _movieNames) {
        for (uint256 i = 0; i < _movieNames.length; i++) {
            movies.push(Movie(i, _movieNames[i], generateRandomNumber()));
        }
    }

    function generateRandomNumber() public returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(salt)));
        salt = randomNumber % 100;
        return salt;
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

    function getVotesByMovieId(uint256 _id) external view returns (uint256) {
        return movies[_id].voteCount;
    }

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
