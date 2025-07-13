import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  marketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
    required: true,
  },
  outcome: {
    type: String, // The name of the outcome the user bet on
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Bet = mongoose.model('Bet', betSchema);

export default Bet;
