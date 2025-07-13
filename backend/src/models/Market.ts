import mongoose from 'mongoose';

export enum OutcomeType {
  YES_NO = 'YES_NO',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  NUMERIC_RANGE = 'NUMERIC_RANGE',
}

interface Outcome {
  name: string;
  liquidity: number;
  odds: number;
}

const marketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  outcomeType: {
    type: String,
    enum: Object.values(OutcomeType),
    required: true,
  },
  outcomes: [
    {
      name: { type: String, required: true },
      liquidity: { type: Number, default: 0 },
      odds: { type: Number, default: 0.5 }, // Initial odds for YES/NO, will be dynamic
    },
  ],
  expiryDate: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedOutcome: {
    type: String,
    default: null,
  },
  totalLiquidity: {
    type: Number,
    default: 0,
  },
  totalVolume: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Market = mongoose.model('Market', marketSchema);

export default Market;
