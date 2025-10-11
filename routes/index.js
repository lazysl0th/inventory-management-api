import express from 'express';
import { register, login } from '../controllers/users.js';
import { signupValidation, signinValidation } from '../middlewares/validation.js';
import { auth } from '../middlewares/auth.js';
import NotFoundError from '../errors/notFound.js';
import { response, roles } from '../constants.js';

const { NOT_FOUND } = response;

const router = express.Router();

router.post('/signup', signupValidation, register);

router.post('/signin', signinValidation, login);

//router.use(auth);

//router.use('/users', auth, authRoles(roles.ADMIN), usersRoutes);

router.use((req, res, next) => next(new NotFoundError(NOT_FOUND.text)));

export default router;