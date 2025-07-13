import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      email,
      password,
    });

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(201).json({ token, userId: user.id, email: user.email, walletBalance: user.walletBalance });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token, userId: user.id, email: user.email, walletBalance: user.walletBalance });
    console.log('Backend: Login response - user:', user);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

export default router;
