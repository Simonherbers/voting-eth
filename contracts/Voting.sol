// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Voting {
    enum VoterState {
        CREATED,
        REGISTERED,
        VOTED
    }
    address payable public creator;
    string[] public movies;

    // eligible movies to vote for
    mapping (string => bool) private _moviesInVoting;

    // all movies mapped to their counts
    mapping (string => uint) private _movieVoteCount;

    // all voter addresses mapped to if they already voted
    mapping (address => VoterState) private _voters;

    event Vote(address who);

    constructor(string[] _movies) payable {
            //block.timestamp < _unlockTime,
        require(
            _movies.length > 0,
            "Please provide at least one movie to vote for."
        );

        for (uint i = 0; i < _movies.length; i++) {
            _moviesInVoting[_movies[i]] = true;
            _movieVoteCount[_movies[i]] = 0;
        }
        movies = _movies;
        creator = payable(msg.sender);
    }   

    function register() public {
        require(
            _voters[msg.sender] == VoterState.CREATED,
            "A voter can only be registered once."
        );
        _voters[msg.sender] = VoterState.REGISTERED;
    }

    function vote(string _movie) public {
        require(
            _voters[msg.sender] == VoterState.REGISTERED,
            "A voter has to be registered and can only vote once."
        );
        require(
            _moviesInVoting[_movie] == true,
            "This movie is not part of this voting's selection."
        );
        _movieVoteCount[_movie] = _movieVoteCount[_movie] + 1;
        _voters[msg.sender] = VoterState.VOTED;

        // maybe this should be kept secret
        emit Vote(msg.sender);
    }

    function results() public {
        mapping (string => uint) [] _results;
        for (uint i = 0; i < movies.length; i++) {
            _results.push(movies[i], _movieVoteCount[movies[i]]);
        }
        // HERE
        // return something like an object, a mapping or a tuple
    }

    // function withdraw() public {
    //     // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
    //     // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
// 
    //     require(block.timestamp >= unlockTime, "You can't withdraw yet");
    //     require(msg.sender == creator, "You aren't the owner");
// 
    //     emit Withdrawal(address(this).balance, block.timestamp);
// 
    //     creator.transfer(address(this).balance);
    // }
}
