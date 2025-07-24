
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

import authRoutes from './routes/authRoutes';

app.use(cors());
app.use(express.json());

import marketRoutes from './routes/marketRoutes';
import betRoutes from './routes/betRoutes';

app.use('/users', authRoutes);
app.use('/markets', marketRoutes);
app.use('/bets', betRoutes);

app.get('/', (req, res) => {
  res.send('Prediction market backend is running');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
