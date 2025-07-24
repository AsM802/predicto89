import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username?: string;
  walletAddress?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, unique: true, sparse: true },
  walletAddress: { type: String, unique: true, sparse: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;