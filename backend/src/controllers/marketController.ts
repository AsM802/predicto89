
import { Request, Response } from 'express';
import Market from '../models/Market';
import { ethers } from 'ethers';
import MarketFactoryABI from '../../artifacts/contracts/MarketFactory.sol/MarketFactory.json';
import PredictionMarketABI from '../../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';

const MARKET_FACTORY_ADDRESS = process.env.MARKET_FACTORY_ADDRESS || ""; // Replace with your deployed MarketFactory address

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/"); // Hardhat local network
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider); // Use a private key from your Hardhat accounts

const marketFactory = new ethers.Contract(MARKET_FACTORY_ADDRESS, MarketFactoryABI.abi, signer);

export const getMarkets = async (req: Request, res: Response) => {
  const { category } = req.query;
  let query = {};
  if (category && category !== 'all') {
    query = { category };
  }
  const markets = await Market.find(query);
  res.json(markets);
};

export const createMarket = async (req: Request, res: Response) => {
  const { question, category, endTimestamp, bettingEndTimestamp, outcomes } = req.body;

  try {
    // Assuming you have a way to get the priceFeedAddress, e.g., from an environment variable or a default mock
    const priceFeedAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Replace with your deployed MockAggregatorV3 address

    const tx = await marketFactory.createMarket(question, endTimestamp, outcomes, priceFeedAddress);
    const receipt = await tx.wait();

    // Extract the deployed market address from the event
    const marketCreatedEvent = receipt.logs.find(
      (log: any) => marketFactory.interface.parseLog(log)?.name === "MarketCreated"
    );
    const contractAddress = marketCreatedEvent?.args?.marketAddress;

    if (!contractAddress) {
      throw new Error("MarketCreated event not found or marketAddress missing.");
    }

    const market = new Market({
      question,
      category,
      endTimestamp,
      bettingEndTimestamp,
      outcomes,
      contractAddress,
    });

    const createdMarket = await market.save();
    res.status(201).json(createdMarket);
  } catch (error) {
    console.error("Error creating market:", error);
    res.status(500).json({ message: "Failed to create market." });
  }
};

export const getMarketById = async (req: Request, res: Response) => {
  const market = await Market.findById(req.params.id);

  if (market) {
    res.json(market);
  } else {
    res.status(404).json({ message: 'Market not found' });
  }
};

export const resolveMarket = async (req: Request, res: Response) => {
  const { marketId, winningOutcomeIndex } = req.body;

  try {
    const market = await Market.findById(marketId);

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    if (!market.contractAddress) {
      return res.status(400).json({ message: 'Market contract address not found.' });
    }

    const predictionMarket = new ethers.Contract(market.contractAddress, PredictionMarketABI.abi, signer);

    const tx = await predictionMarket.resolveMarket(winningOutcomeIndex);
    await tx.wait();

    market.resolved = true;
    market.winningOutcomeIndex = winningOutcomeIndex;

    const updatedMarket = await market.save();
    res.json(updatedMarket);
  } catch (error) {
    console.error("Error resolving market:", error);
    res.status(500).json({ message: "Failed to resolve market." });
  }
};
