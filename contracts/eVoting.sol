// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract eVoting {
    address public owner; //owner
    uint256 public candidateCount; // total candidates
    uint256 public votingCounts; // total voting counts
    uint256 public maxVote = 1;

    constructor() {
        owner = msg.sender; // assigning owners
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You cannot add Candidate");
        _;
    }

    struct Candidate {
        string candidateName;
        uint256 candidateNumber;
        string party;
    }

    Candidate[] public activeCandidates; //array of active candidates
    mapping(uint256 => uint256) public votes;

    function vote(uint256 _candidateNumber) external {
        // voting logic
        require(maxVote == 1, "You have already Voted!");
        maxVote--;
        votes[_candidateNumber]++;
        votingCounts++;
    }

    function addCandidate(
        string memory _candidateName,
        string memory _party
    ) public onlyOwner {
        activeCandidates.push(
            Candidate(_candidateName, candidateCount + 1, _party)
        );
        candidateCount++;
    }
}
