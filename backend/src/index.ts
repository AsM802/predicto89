import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import marketRoutes from './routes/marketRoutes';
import ctfAdapterRoutes from './routes/ctfAdapterRoutes';
import createBetRouter from './routes/betRoutes';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'], // Added PUT for market resolution
  },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/adapter', ctfAdapterRoutes);
app.use('/api/bets', createBetRouter(io));

app.get('/', (req, res) => {
  res.send('Predicto89 Backend API is running!');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinMarket', (marketId: string) => {
    socket.join(marketId);
    console.log(`User ${socket.id} joined market room ${marketId}`);
  });

  socket.on('leaveMarket', (marketId: string) => {
    socket.leave(marketId);
    console.log(`User ${socket.id} left market room ${marketId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});