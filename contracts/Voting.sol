// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract Voting is ERC721 {
    // --- Storage ---

    // Mapping from movie id to movie name
    mapping(uint256 => string) public movieNames;
    // Mapping from movie id to vote count
    mapping(uint256 => uint256) public voteCounts;
    // Mapping from NFT tokenId to movie id
    mapping(uint256 => uint256) public nftIdsToMovieIds;
    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;
    // Counter for NFT tokenIds
    uint256 public nextTokenId;
    // Mapping to track which address has voted for which movie
    mapping(address => uint256) public addressToMovieId;

    // --- Events ---
    event Voted(uint256 movieId);

    // --- Constructor ---
    constructor(uint256[] memory initialMovieIds, string[] memory initialMovieTitles) ERC721("VotingNFT", "VOTE") {
        require(initialMovieIds.length == initialMovieTitles.length, "Mismatched input lengths");

        nextTokenId = 0;

        for (uint i = 0; i < initialMovieIds.length; i++) {
            _addMovie(initialMovieIds[i], initialMovieTitles[i]);
        }
    }

    // --- Internal Logic ---

    // Internal function to add a new movie
    function _addMovie(uint256 _movie_id, string memory _name) internal {
        movieNames[_movie_id] = _name;
        voteCounts[_movie_id] = 0;
    }

    // --- External Functions ---

    // Standard function (not gasless)
    function addMovie(uint256 movie_id, string memory name) external {
        _addMovie(movie_id, name);
    }

    function vote(uint256 _movieId) external {
        require(!hasVoted[msg.sender], "Already voted");
        voteCounts[_movieId]++;
        hasVoted[msg.sender] = true;

        // Mint NFT to voter
        _mint(msg.sender, nextTokenId);
        addressToMovieId[msg.sender] = nextTokenId;
        nftIdsToMovieIds[nextTokenId] = _movieId;
        nextTokenId++;

        emit Voted(_movieId);
    }

    // --- Utilities ---

    function getMovieById(uint256 movieId) external view returns (string memory) {
        string memory mapping_val = movieNames[movieId];
        if(bytes(mapping_val).length > 0) {
            return mapping_val;
        }
        return "";
    }

    function getTop5Movies() public view returns (uint256[5] memory topMovieIds) {
        uint256 len = nextTokenId;
        uint256[5] memory topVotes;
        uint256[5] memory topIds;

        for (uint256 i = 0; i < len; i++) {
            uint256 id = nftIdsToMovieIds[i];
            uint256 v = voteCounts[id];

            for (uint256 j = 0; j < 5; j++) {
                if (v >= topVotes[j]) {
                    // Shift lower values down
                    for (uint256 k = 4; k > j; k--) {
                        topVotes[k] = topVotes[k - 1];
                        topIds[k] = topIds[k - 1];
                    }

                    topVotes[j] = v;
                    topIds[j] = id;
                    break;
                }
            }
        }

        return topIds;
    }

    function getVoteCountByMovieId(
        uint256 _movieId
    ) external view returns (uint256) {
        return voteCounts[_movieId];
    }

    function getMovieVotedFor(address voter) public view returns (string memory) {
        require(hasVoted[voter], "Address has not voted yet");
        uint256 tokenId = addressToMovieId[voter];
        require(tokenId < nextTokenId, "Invalid token ID");
        require(nftIdsToMovieIds[tokenId] != 0, "No movie associated with this token ID");
        uint256 movieId = nftIdsToMovieIds[tokenId];
        return movieNames[movieId];    
    }
}


