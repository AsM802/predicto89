import express, { Request, Response } from 'express';
const { body, validationResult } = require('express-validator');
import auth from '../middleware/auth';
import Bet from '../models/Bet';
import Market from '../models/Market';
import User from '../models/User';
import { Server as SocketIOServer } from 'socket.io';

const createBetRouter = (io: SocketIOServer) => {
  const router = express.Router();

// Helper function for AMM (Constant Product Formula: x * y = k)
const calculateNewOdds = (market: any, outcomeName: string, betAmount: number) => {
  // This is a simplified AMM. In a real system, this would be more complex.
  // For Yes/No markets, we can think of it as two pools.
  // For simplicity, let's assume a fixed k for now or a dynamic one based on total liquidity.

  const totalLiquidity = market.totalLiquidity + betAmount;
  const outcome = market.outcomes.find((o: any) => o.name === outcomeName);

  if (!outcome) {
    throw new Error('Outcome not found');
  }

  // Simple odds calculation based on liquidity distribution
  // Odds = (Opposing Liquidity) / (Total Liquidity)
  // Or, for a more intuitive approach: Odds = (Outcome Liquidity) / (Total Liquidity)
  // Let's use the latter for now, representing probability.

  // Update liquidity for the chosen outcome
  outcome.liquidity += betAmount;

  // Recalculate odds for all outcomes based on their new liquidity relative to total liquidity
  market.outcomes.forEach((o: any) => {
    o.odds = o.liquidity / totalLiquidity;
  });

  market.totalLiquidity = totalLiquidity;
  market.totalVolume += betAmount;
};

// @route   POST api/bets
// @desc    Place a bet on a market
// @access  Private
router.post(
  '/',
  auth,
  [
    body('marketId', 'Market ID is required').not().isEmpty(),
    body('outcome', 'Outcome is required').not().isEmpty(),
    body('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { marketId, outcome, amount } = req.body;

    try {
      const market = await Market.findById(marketId);
      const user = await User.findById(req.userId);

      if (!market) {
        return res.status(404).json({ message: 'Market not found' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (market.resolved) {
        return res.status(400).json({ message: 'Cannot bet on a resolved market' });
      }

      if (new Date() > market.expiryDate) {
        return res.status(400).json({ message: 'Market has expired' });
      }

      if (user.walletBalance < amount) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }

      // Deduct amount from user's wallet
      user.walletBalance -= amount;
      await user.save();

      // Update market odds and liquidity using AMM logic
      calculateNewOdds(market, outcome, amount);
      await market.save();

      // Emit real-time update for the market
      io.to(marketId).emit('marketUpdate', market);

      const newBet = new Bet({
        userId: req.userId,
        marketId,
        outcome,
        amount,
      });

      const bet = await newBet.save();
      res.json(bet);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/bets/me
// @desc    Get all bets for the authenticated user
// @access  Private
router.get('/me', auth, async (req: any, res: Response) => {
  try {
    const bets = await Bet.find({ userId: req.userId }).populate('marketId', ['title', 'description', 'outcomeType']);
    res.json(bets);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

  return router;
};

export default createBetRouter;