// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

pragma solidity >=0.7.0 <0.9.0;

contract ERC20Mintable is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function mint(address to, uint256 amount) public {
        require(hasRole(MINTER_ROLE, _msgSender()));
        _mint(to, amount);
    }
}

/** 
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */
contract BallotModified is AccessControl {
    bytes32 public constant CHAIRPERSON_ROLE = keccak256("CHAIRPERSON_ROLE");
    uint256 public constant VOTE_UNITS = 1e18;
    
    address public votingTokenAddress;
   
    struct Voter {
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
    }

    struct Proposal {
        // If you can limit the length to a certain number of bytes, 
        // always use one of bytes1 to bytes32 because they are much cheaper
        bytes32 name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    address public chairperson;

    mapping(address => Voter) public voters;

    Proposal[] public proposals;

    /** 
     * @dev Create a new ballot to choose one of 'proposalNames'.
     * @param proposalNames names of proposals
     */
    constructor(bytes32[] memory proposalNames) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(CHAIRPERSON_ROLE, msg.sender);
        ERC20Mintable votingTokenContract = new ERC20Mintable("Voting Ballot Token", "VBT");
        votingTokenAddress = address(votingTokenContract);
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }
    
    /** 
     * @dev Give 'voter' the right to vote on this ballot. May only be called by 'chairperson'.
     * @param voter address of voter
     */
    function giveRightToVote(address voter) public {
        require(hasRole(CHAIRPERSON_ROLE, msg.sender), "Caller is not a chairperson");
        require(ERC20Mintable(votingTokenAddress).balanceOf(voter) == 0);
        ERC20Mintable(votingTokenAddress).mint(voter, VOTE_UNITS);
    }

    /**
     * @dev Delegate your vote to the voter 'to'.
     * @param to address to which vote is delegated
     */
    function delegate(address to) public pure {
        require(false, "Not implemented");
    }

    /**
     * @dev Give your vote (including votes delegated to you) to proposal 'proposals[proposal].name'.
     * @param proposal index of proposal in the proposals array
     */
    function vote(uint proposal) public {
        Voter storage sender = voters[msg.sender];
        ERC20Mintable(votingTokenAddress).transferFrom(_msgSender(), address(this), VOTE_UNITS);
        sender.vote = proposal;
        proposals[proposal].voteCount += VOTE_UNITS;
    }

    /** 
     * @dev Computes the winning proposal taking all previous votes into account.
     * @return winningProposal_ index of winning proposal in the proposals array
     */
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /** 
     * @dev Calls winningProposal() function to get the index of the winner contained in the proposals array and then
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view
            returns (bytes32 winnerName_)
    {
        winnerName_ = proposals[winningProposal()].name;
    }
}
