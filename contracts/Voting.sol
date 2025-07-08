// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Voting is ERC721 {
    // --- Storage ---

    // Mapping from tokenId (NFT) to movie name
    mapping(uint256 => string) public movieNames;
    mapping(uint256 => uint256) public nftIdsToMovieIds;
    // Mapping from tokenId (NFT) to vote count
    mapping(uint256 => uint256) public voteCounts;
    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;
    // Salt for generating random numbers (not secure, for demo only)
    uint256 salt = 25;
    // Counter for NFT tokenIds
    uint256 public nextTokenId;

    // --- EIP-712 Meta Tx State ---

    // bytes32 public constant ADDMOVIE_TYPEHASH =
    //     keccak256("AddMovie(uint256 movie_id,string name,uint256 nonce,address user)");
    // bytes32 public DOMAIN_SEPARATOR;
    // mapping(address => uint256) public nonces;

    // --- Events ---
    event Voted(uint256 movieId);

    // --- Constructor ---
    constructor(uint256[] memory initialMovieIds, string[] memory initialMovieTitles) ERC721("VotingNFT", "VOTE") {
        require(initialMovieIds.length == initialMovieTitles.length, "Mismatched input lengths");

        nextTokenId = 0;

        for (uint i = 0; i < initialMovieIds.length; i++) {
            _addMovie(initialMovieIds[i], initialMovieTitles[i]);
        }
        // DOMAIN_SEPARATOR = keccak256(
        //     abi.encode(
        //         keccak256(
        //             "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        //         ),
        //         keccak256(bytes("VotingNFT")),
        //         keccak256(bytes("1")),
        //         block.chainid,
        //         address(this)
        //     )
        // );
    }

    // --- Internal Logic ---

    // Internal function to add a new movie
    function _addMovie(uint256 _movie_id, string memory _name) internal {
        movieNames[_movie_id] = _name;
        voteCounts[_movie_id] = 0; // remove random number in production
        nftIdsToMovieIds[nextTokenId] = _movie_id;
        _mint(msg.sender, nextTokenId);
        nextTokenId++;
    }

    // --- External Functions ---

    // Standard function (not gasless)
    function addMovie(uint256 movie_id, string memory name) external {
        _addMovie(movie_id, name);
    }

    // // Gasless function via meta-transaction to call _addMovie
    // function relayAddMovie(
    //     uint256 movie_id,
    //     string memory name,
    //     address user,
    //     uint256 nonce,
    //     bytes memory signature
    // ) external {
    //     require(nonce == nonces[user], "Invalid nonce");
// 
    //     bytes32 structHash = keccak256(
    //         abi.encode(
    //             ADDMOVIE_TYPEHASH,
    //             movie_id,
    //             keccak256(bytes(name)),
    //             nonce,
    //             user
    //         )
    //     );
// 
    //     bytes32 digest = keccak256(
    //         abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
    //     );
// 
    //     address signer = recoverSigner(digest, signature);
    //     require(signer == user, "Invalid signature");
// 
    //     nonces[user]++; // Prevent replay
    //     _addMovie(movie_id, name);
    // }

    // --- Signature Recovery ---

    // function recoverSigner(
    //     bytes32 digest,
    //     bytes memory signature
    // ) public pure returns (address) {
    //     require(signature.length == 65, "Invalid signature length");
    //     bytes32 r;
    //     bytes32 s;
    //     uint8 v;
    //     assembly {
    //         r := mload(add(signature, 32))
    //         s := mload(add(signature, 64))
    //         v := byte(0, mload(add(signature, 96)))
    //     }
    //     return ecrecover(digest, v, r, s);
    // }

    // --- Voting ---

    function vote(uint256 _movieId) external {
        require(!hasVoted[msg.sender], "Already voted");
        voteCounts[_movieId]++;
        hasVoted[msg.sender] = true;
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

    function generateRandomNumber() public returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(salt)));
        salt = randomNumber % 100;
        return salt;
    }

    function getMoviesCount() external view returns (uint256) {
        return nextTokenId;
    }

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

    function getVotesByMovieId(uint256 _id) external view returns (uint256) {
        require(_id < nextTokenId, "Invalid movie ID");
        return voteCounts[_id];
    }

    function getMovieIdByName(
        string memory _movieName
    ) external view returns (uint256) {
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (bytes(movieNames[i]).length != bytes(_movieName).length) {
                continue;
            }
            bool equal = true;
            for (uint256 a = 0; a < bytes(_movieName).length; a++) {
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
