
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PredictionMarket is Ownable {
    struct Market {
        string question;
        uint256 endTimestamp;
        uint256 totalAmount;
        string[] outcomes;
        mapping(uint256 => uint256) outcomeAmounts;
        bool resolved;
        uint256 winningOutcomeIndex;
        address creator;
    }

    Market[] public markets;
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) public bets;

    event MarketCreated(uint256 indexed marketId, string question, uint256 endTimestamp);
    event BetPlaced(uint256 indexed marketId, address indexed user, uint256 outcomeIndex, uint256 amount);
    event MarketResolved(uint256 indexed marketId, uint256 winningOutcomeIndex);

    AggregatorV3Interface internal priceFeed;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function createMarket(string memory _question, uint256 _endTimestamp, string[] memory _outcomes) public {
        markets.push(); // Push an empty struct first
        uint256 newMarketId = markets.length - 1;
        Market storage newMarket = markets[newMarketId];

        newMarket.question = _question;
        newMarket.endTimestamp = _endTimestamp;
        newMarket.totalAmount = 0;
        newMarket.outcomes = _outcomes;
        newMarket.resolved = false;
        newMarket.winningOutcomeIndex = 0; // Default to 0 or handle appropriately
        newMarket.creator = msg.sender;

        emit MarketCreated(newMarketId, _question, _endTimestamp);
    }

    function placeBet(uint256 _marketId, uint256 _outcomeIndex) public payable {
        require(_marketId < markets.length, "Market does not exist.");
        require(!markets[_marketId].resolved, "Market is already resolved.");
        require(block.timestamp < markets[_marketId].endTimestamp, "Market has ended.");
        require(msg.value > 0, "Bet amount must be greater than 0.");

        bets[_marketId][msg.sender][_outcomeIndex] += msg.value;
        markets[_marketId].totalAmount += msg.value;
        markets[_marketId].outcomeAmounts[_outcomeIndex] += msg.value;
    }

    function resolveMarket(uint256 _marketId, uint256 _winningOutcomeIndex) public onlyOwner {
        require(_marketId < markets.length, "Market does not exist.");
        require(!markets[_marketId].resolved, "Market is already resolved.");
        require(block.timestamp >= markets[_marketId].endTimestamp, "Market has not ended yet.");

        require(_winningOutcomeIndex < markets[_marketId].outcomes.length, "Invalid winning outcome index.");

        markets[_marketId].resolved = true;
        markets[_marketId].winningOutcomeIndex = _winningOutcomeIndex;

        emit MarketResolved(_marketId, _winningOutcomeIndex);
    }

    function claimWinnings(uint256 _marketId) public {
        require(_marketId < markets.length, "Market does not exist.");
        require(markets[_marketId].resolved, "Market is not resolved yet.");

        uint256 userBetOnWinningOutcome = bets[_marketId][msg.sender][markets[_marketId].winningOutcomeIndex];
        require(userBetOnWinningOutcome > 0, "You have not placed a bet on the winning outcome in this market.");

        uint256 winnings = (userBetOnWinningOutcome * markets[_marketId].totalAmount) / markets[_marketId].outcomeAmounts[markets[_marketId].winningOutcomeIndex];
        payable(msg.sender).transfer(winnings);

        bets[_marketId][msg.sender][markets[_marketId].winningOutcomeIndex] = 0;
    }
}
