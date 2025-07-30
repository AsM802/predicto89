import mongoose from 'mongoose';

const marketSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, required: true },
  endTimestamp: { type: Number, required: true },
  bettingEndTimestamp: { type: Number, required: true },
  outcomes: { type: [String], required: true },
  resolved: { type: Boolean, default: false },
  winningOutcomeIndex: { type: Number, default: -1 }, // -1 means not resolved yet
  outcomeAmounts: { type: Map, of: Number, default: {} },
  contractAddress: { type: String, unique: true, sparse: true },
  volume: { type: String, default: "0" },
  participants: { type: Number, default: 0 },
});

const Market = mongoose.model('Market', marketSchema);

export default Market;