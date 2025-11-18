import express from 'express';
import limiter from '../middlewares/limiter.js';
import authRoutes from '../routes/auth.js';
import usersRoutes from './users.js';
import graphqlRoute from './graphql.js';
import uploadRouter from "./upload.js";
import salesForceRoutes from './salesForce.js';
import inventoriesRoute from './inventories.js'
import supportRoute from './support.js'
import NotFoundError from '../errors/notFound.js';
import { response } from '../constants.js';
import '../services/passport/passport.js'

const { NOT_FOUND } = response;

const router = express.Router();

router.use(authRoutes);

router.use('/users', limiter, usersRoutes);

router.use('/salesForce', salesForceRoutes);

router.use('/inventories', inventoriesRoute);

router.use('/graphql', graphqlRoute);

router.use('/image', uploadRouter);

router.use('/support', supportRoute);

router.use((req, res, next) => next(new NotFoundError(NOT_FOUND.text)));

export default router;