import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from './common/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import itemsRoutes from './modules/items/items.routes';
import usersRoutes from './modules/users/users.routes';
import conversationsRoutes from './modules/conversations/conversations.routes';
import uploadsRoutes from './modules/uploads/uploads.routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:6767',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/uploads', uploadsRoutes);
// app.use('/api/transactions', transactionsRoutes);

app.use(errorMiddleware);

export default app;
