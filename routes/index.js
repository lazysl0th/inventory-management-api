import express from 'express';
import passport from 'passport';
import authRoutes from '../routes/auth.js';
import usersRoutes from './users.js';
import NotFoundError from '../errors/notFound.js';
import { response } from '../constants.js';
import '../services/passport/passport.js'

const { NOT_FOUND } = response;

const router = express.Router();

router.use(authRoutes);

router.use('/users', usersRoutes);

router.use((req, res, next) => next(new NotFoundError(NOT_FOUND.text)));

export default router;