// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, ebool } from "../lib/fhevm-local/FHE.sol";
import { SepoliaConfig } from "../lib/fhevm-local/ZamaConfig.sol";

contract EncryptedPolls is SepoliaConfig {
    // Poll structure
    struct Poll {
        string question;
        string optionA;
        string optionB;
        euint64 votesA;
        euint64 votesB;
        bool decrypted;
        uint64 decryptedVotesA;
        uint64 decryptedVotesB;
    }

    // Storage
    Poll[7] public polls; // 7 educational polls
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    address public owner;
    uint256 public constant POLL_COUNT = 7; // 7 educational polls

    // Events
    event VoteSubmitted(uint256 indexed pollId, address indexed voter);
    event ResultsDecrypted(uint256 indexed pollId, uint64 votesA, uint64 votesB);

    constructor() {
        owner = msg.sender;
        _initializePolls();
    }

    function _initializePolls() private {
        // Poll 0: Bitcoin
        polls[0] = Poll({
            question: "Will Bitcoin reach $150k by end of 2025?",
            optionA: "Yes",
            optionB: "No",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
        
        // Poll 1: AI Regulation
        polls[1] = Poll({
            question: "Should AI development be regulated?",
            optionA: "Yes, regulate it",
            optionB: "No, let it develop freely",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
        
        // Poll 2: Remote Work
        polls[2] = Poll({
            question: "Is remote work the future?",
            optionA: "Yes, remote is better",
            optionB: "No, office work is better",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
        
        // Poll 3: Mars Colonization
        polls[3] = Poll({
            question: "Should we colonize Mars?",
            optionA: "Yes, let's go to Mars",
            optionB: "No, focus on Earth",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
        
        // Poll 4: Cryptocurrency
        polls[4] = Poll({
            question: "Is cryptocurrency the future of money?",
            optionA: "Yes, crypto will replace fiat",
            optionB: "No, traditional money will remain",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
        
        // Poll 5: Renewable Energy
        polls[5] = Poll({
            question: "Should we invest in renewable energy?",
            optionA: "Yes, go green now",
            optionB: "No, stick with fossil fuels",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
        
        // Poll 6: AGI
        polls[6] = Poll({
            question: "Is artificial general intelligence achievable?",
            optionA: "Yes, AGI is possible",
            optionB: "No, AGI is impossible",
            votesA: FHE.asEuint64(0),
            votesB: FHE.asEuint64(0),
            decrypted: false,
            decryptedVotesA: 0,
            decryptedVotesB: 0
        });
    }

    // Submit encrypted vote
    function submitVote(
        uint256 pollId,
        euint64 encryptedVote
    ) external {
        require(pollId < POLL_COUNT, "Invalid poll ID");
        require(!hasVoted[pollId][msg.sender], "Already voted");

        // Allow access to encrypted input
        FHE.allow(encryptedVote, msg.sender);
        FHE.allowThis(encryptedVote);
        
        // Create encrypted 1
        euint64 one = FHE.asEuint64(1);
        
        // If vote == 0, add to A, else add to B
        ebool isVoteA = FHE.eq(encryptedVote, FHE.asEuint64(0));
        euint64 voteForA = FHE.select(isVoteA, one, FHE.asEuint64(0));
        euint64 voteForB = FHE.select(isVoteA, FHE.asEuint64(0), one);
        
        // Add votes
        polls[pollId].votesA = FHE.add(polls[pollId].votesA, voteForA);
        polls[pollId].votesB = FHE.add(polls[pollId].votesB, voteForB);
        
        // Allow access to updated vote counts
        FHE.allow(polls[pollId].votesA, msg.sender);
        FHE.allow(polls[pollId].votesB, msg.sender);
        FHE.allowThis(polls[pollId].votesA);
        FHE.allowThis(polls[pollId].votesB);
        
        hasVoted[pollId][msg.sender] = true;
        
        emit VoteSubmitted(pollId, msg.sender);
    }

    // Request decryption of results (owner only)
    function requestDecryption(uint256 pollId) external {
        require(msg.sender == owner, "Only owner can request decryption");
        require(pollId < POLL_COUNT, "Invalid poll ID");
        require(!polls[pollId].decrypted, "Poll already decrypted");
        
        // Make encrypted votes publicly decryptable
        FHE.makePubliclyDecryptable(polls[pollId].votesA);
        FHE.makePubliclyDecryptable(polls[pollId].votesB);
        
        // Mark as decrypted (actual decryption happens off-chain via Relayer SDK)
        polls[pollId].decrypted = true;
        
        emit ResultsDecrypted(pollId, 0, 0); // Placeholder values, actual decryption via SDK
    }

    // Get poll info
    function getPoll(uint256 pollId) external view returns (
        string memory question,
        string memory optionA,
        string memory optionB,
        bool decrypted,
        uint64 decryptedVotesA,
        uint64 decryptedVotesB
    ) {
        require(pollId < POLL_COUNT, "Invalid poll ID");
        Poll memory poll = polls[pollId];
        return (
            poll.question,
            poll.optionA,
            poll.optionB,
            poll.decrypted,
            poll.decryptedVotesA,
            poll.decryptedVotesB
        );
    }

    // Check if user has voted
    function hasUserVoted(uint256 pollId, address user) external view returns (bool) {
        return hasVoted[pollId][user];
    }

    // Update decrypted vote counts (owner only, called after off-chain decryption)
    function updateDecryptedResults(
        uint256 pollId,
        uint64 decryptedVotesA,
        uint64 decryptedVotesB
    ) external {
        require(msg.sender == owner, "Only owner can update results");
        require(pollId < POLL_COUNT, "Invalid poll ID");
        require(polls[pollId].decrypted, "Poll must be decrypted first");
        
        polls[pollId].decryptedVotesA = decryptedVotesA;
        polls[pollId].decryptedVotesB = decryptedVotesB;
        
        emit ResultsDecrypted(pollId, decryptedVotesA, decryptedVotesB);
    }
}
