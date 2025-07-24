
import { Request, Response } from 'express';
import Bet from '../models/Bet';
import Market from '../models/Market';
import { ethers } from 'ethers';
import PredictionMarketABI from '../../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/"); // Hardhat local network
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider); // Use a private key from your Hardhat accounts

export const placeBet = async (req: Request, res: Response) => {
  const { marketId, outcomeIndex, amount } = req.body;
  const userId = (req as any).user.id;

  try {
    const market = await Market.findById(marketId);

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    if (!market.contractAddress) {
      return res.status(400).json({ message: 'Market contract address not found.' });
    }

    const predictionMarket = new ethers.Contract(market.contractAddress, PredictionMarketABI.abi, signer);

    const tx = await predictionMarket.placeBet(outcomeIndex, { value: ethers.parseEther(amount.toString()) });
    await tx.wait();

    const bet = new Bet({
      market: marketId,
      user: userId,
      outcomeIndex,
      amount,
    });

    const createdBet = await bet.save();
    res.status(201).json(createdBet);
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ message: "Failed to place bet." });
  }
};
