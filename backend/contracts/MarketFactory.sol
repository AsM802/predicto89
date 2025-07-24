
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PredictionMarket.sol";

contract MarketFactory {
    address[] public deployedMarkets;

    event MarketCreated(address marketAddress, string question);

    function createMarket(string memory _question, uint256 _endTimestamp, string[] memory _outcomes, address _priceFeed) public {
        PredictionMarket newMarket = new PredictionMarket(_priceFeed);
        newMarket.createMarket(_question, _endTimestamp, _outcomes);
        deployedMarkets.push(address(newMarket));
        emit MarketCreated(address(newMarket), _question);
    }

    function getDeployedMarkets() public view returns (address[] memory) {
        return deployedMarkets;
    }
}
