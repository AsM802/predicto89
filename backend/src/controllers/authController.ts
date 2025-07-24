
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

export const authWallet = async (req: Request, res: Response) => {
  const { walletAddress: rawWalletAddress, signature, username } = req.body;
  const walletAddress = rawWalletAddress.toLowerCase();

  if (!walletAddress || !signature) {
    res.status(400).json({ message: 'Please provide wallet address and signature' });
    return;
  }

  try {
    const message = `Sign in to Predicto89 with wallet ${rawWalletAddress}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress) {
      res.status(401).json({ message: 'Invalid signature' });
      return;
    }

    let user = await User.findOneAndUpdate(
      { walletAddress },
      { $setOnInsert: { walletAddress, username: username || `user_${Date.now()}` } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        token: generateToken(user._id.toString() as string),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Backend Authentication Error:", error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};
