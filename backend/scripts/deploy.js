
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MockAggregatorV3 = await hre.ethers.getContractFactory("MockAggregatorV3");
  const mockAggregatorV3 = await MockAggregatorV3.deploy(hre.ethers.parseUnits("100", 18), {});
  console.log("MockAggregatorV3 deployed to:", mockAggregatorV3.target);

  const MarketFactoryArtifact = require("../artifacts/contracts/MarketFactory.sol/MarketFactory.json");
  const MarketFactory = new ethers.ContractFactory(MarketFactoryArtifact.abi, MarketFactoryArtifact.bytecode, deployer);
  const marketFactory = await MarketFactory.deploy();
  console.log("MarketFactory deployed to:", marketFactory.target);

  // Create a test market
  const question = "Will the price of ETH exceed $5000 by end of 2025?";
  const endTimestamp = Math.floor(Date.now() / 1000) + (86400 * 30); // 30 days from now
  const outcomes = ["Yes", "No"];
  const priceFeedAddress = mockAggregatorV3.target;

  const tx = await marketFactory.createMarket(question, endTimestamp, outcomes, priceFeedAddress);
  await tx.wait();

  const deployedMarkets = await marketFactory.getDeployedMarkets();
  console.log("Test Market deployed to:", deployedMarkets[0]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
