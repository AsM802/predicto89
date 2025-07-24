
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PredictionMarket", function () {
  let PredictionMarket, predictionMarket, MockAggregatorV3, mockAggregatorV3, owner, addr1, addr2;

  beforeEach(async function () {
    MockAggregatorV3 = await ethers.getContractFactory("MockAggregatorV3");
    mockAggregatorV3 = await MockAggregatorV3.deploy(2000 * 10**8); // Initial price of 2000
    await mockAggregatorV3.deployed();

    PredictionMarket = await ethers.getContractFactory("PredictionMarket");
    predictionMarket = await PredictionMarket.deploy(mockAggregatorV3.address);
    await predictionMarket.deployed();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should create a new market", async function () {
    const question = "Will the price of ETH be above $2500 by the end of the week?";
    const endTimestamp = Math.floor(Date.now() / 1000) + 604800; // 1 week from now

    await predictionMarket.createMarket(question, endTimestamp);

    const market = await predictionMarket.markets(0);
    expect(market.question).to.equal(question);
    expect(market.endTimestamp).to.equal(endTimestamp);
  });

  it("Should allow users to place bets", async function () {
    const question = "Test market";
    const endTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    await predictionMarket.createMarket(question, endTimestamp);

    await predictionMarket.connect(addr1).placeBet(0, true, { value: ethers.utils.parseEther("1.0") });

    const market = await predictionMarket.markets(0);
    const userBet = await predictionMarket.bets(0, addr1.address);

    expect(market.totalAmount).to.equal(ethers.utils.parseEther("1.0"));
    expect(market.yesAmount).to.equal(ethers.utils.parseEther("1.0"));
    expect(userBet).to.equal(ethers.utils.parseEther("1.0"));
  });

  it("Should resolve the market", async function () {
    const question = "Test market";
    const endTimestamp = Math.floor(Date.now() / 1000) + 1; // 1 second from now
    await predictionMarket.createMarket(question, endTimestamp);

    // Wait for the market to end
    await new Promise(resolve => setTimeout(resolve, 2000));

    await predictionMarket.resolveMarket(0);

    const market = await predictionMarket.markets(0);
    expect(market.resolved).to.be.true;
  });
});
