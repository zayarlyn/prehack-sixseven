import express from 'express';
import cors from 'cors';
import { errorMiddleware } from './common/middleware/error.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routers here under /api prefix
// app.use('/api/auth', authRoutes);
// app.use('/api/users', usersRoutes);
// app.use('/api/items', itemsRoutes);
// app.use('/api/uploads', uploadsRoutes);
// app.use('/api/conversations', conversationsRoutes);
// app.use('/api/transactions', transactionsRoutes);

app.use(errorMiddleware);

export default app;
