import express from 'express';
import limiter from '../middlewares/limiter.js';
import authRoutes from '../routes/auth.js';
import usersRoutes from './users.js';
import inventoryRoute from './inventory.js';
import uploadRouter from "./upload.js";
import salesForceRoutes from './salesForce.js';
import NotFoundError from '../errors/notFound.js';
import { response } from '../constants.js';
import '../services/passport/passport.js'

const { NOT_FOUND } = response;

const router = express.Router();

router.use(authRoutes);

router.use('/users', limiter, usersRoutes);

router.use('/salesForce', salesForceRoutes);

router.use('/graphql', inventoryRoute);

router.use('/image', uploadRouter);

router.use((req, res, next) => next(new NotFoundError(NOT_FOUND.text)));

export default router;