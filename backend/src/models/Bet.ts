import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  market: { type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  outcomeIndex: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const Bet = mongoose.model('Bet', betSchema);

export default Bet;