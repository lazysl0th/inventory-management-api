import express from 'express';
import helmet from 'helmet';
import cors from './middlewares/cors.js';
import limiter from './middlewares/limiter.js';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import config from './config.js';

const { PORT } = config;
const prisma = new PrismaClient();

const app = express();
app.use(helmet());
app.use(cors);
app.use(limiter);
app.use(morgan('dev'));

app.get("/serverhealth", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.get('/dbhealth', async (req, res) => {
  const dbStatus = await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok', db: dbStatus ? 'connected' : 'error' });
})

app.listen(PORT);