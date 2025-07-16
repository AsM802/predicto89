import express, { Request, Response } from 'express';
const { body, validationResult } = require('express-validator');
import Market, { OutcomeType } from '../models/Market';
import Bet from '../models/Bet'; // Import Bet model
import User from '../models/User'; // Import User model
import auth from '../middleware/auth';

// Extend the Request interface to include userId
interface AuthRequest extends Request {
  userId?: string;
}

const router = express.Router();

// @route   POST api/markets
// @desc    Create a new market
// @access  Private
router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('outcomeType', 'Outcome type is required').isIn(Object.values(OutcomeType)),
    body('outcomes', 'Outcomes are required and must be an array').isArray().notEmpty(),
    body('expiryDate', 'Expiry date is required and must be a future date').isISO8601().toDate()
      .custom((value: Date) => { // Explicitly type value as Date
        if (new Date(value) <= new Date()) {
          throw new Error('Expiry date must be in the future');
        }
        return true;
      }),
  ],
  async (req: AuthRequest, res: Response) => { // Use AuthRequest and Response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors: errors.array() });
    }

    const { title, description, outcomeType, outcomes, expiryDate } = req.body;

    try {
      const newMarket = new Market({
        title,
        description,
        outcomeType,
        outcomes,
        expiryDate,
        ...(req.userId && { creator: req.userId }), // Only add creator if userId exists
      });

      const market = await newMarket.save();
      res.json(market);
    } catch (err: any) {
      console.error('Market creation error:', err.message, err.stack);
      res.status(500).json({ message: 'Server Error during market creation', error: err.message });
    }
  }
);

// @route   GET api/markets
// @desc    Get all active markets
// @access  Public
router.get('/', async (req: Request, res: Response) => { // Use Request and Response
  try {
    const markets = await Market.find({ resolved: false }).sort({ createdAt: -1 });
    res.json(markets);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/markets/:id
// @desc    Get market by ID
// @access  Public
router.get('/:id', async (req: Request, res: Response) => { // Use Request and Response
  try {
    const market = await Market.findById(req.params.id); // req.params.id is correct here

    if (!market) {
      return res.status(404).json({ message: 'Market not found' });
    }

    res.json(market);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Market not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/markets/:id/resolve
// @desc    Resolve a market (Admin only for now)
// @access  Private (Admin)
router.put(
  '/:id/resolve',
  auth,
  [
    body('resolvedOutcome', 'Resolved outcome is required').not().isEmpty(),
  ],
  async (req: AuthRequest, res: Response) => { // Use AuthRequest and Response
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { resolvedOutcome } = req.body;

    try {
      let market = await Market.findById(req.params.id);

      if (!market) {
        return res.status(404).json({ message: 'Market not found' });
      }

      // TODO: Add admin check here
      if (market.resolved) {
        return res.status(400).json({ message: 'Market already resolved' });
      }

      market.resolved = true;
      market.resolvedOutcome = resolvedOutcome;
      await market.save();

      // Payout logic
      const winningBets = await Bet.find({ marketId: market._id, outcome: resolvedOutcome });

      for (const bet of winningBets) {
        const user = await User.findById(bet.userId);
        if (user) {
          // Calculate payout based on odds at the time of resolution or a simplified multiplier
          // For simplicity, let's assume a fixed payout multiplier for now, or use the odds from the market
          const winningOutcome = market.outcomes.find(o => o.name === resolvedOutcome);
          if (winningOutcome) {
            // Payout = bet amount / winning probability (odds)
            // If odds are 0.5 (50%), payout is 2x. If 0.25 (25%), payout is 4x.
            const payout = bet.amount / winningOutcome.odds;
            user.walletBalance += payout;
            await user.save();
          }
        }
      }

      res.json(market);
    } catch (err: any) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Market not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

export default router;
