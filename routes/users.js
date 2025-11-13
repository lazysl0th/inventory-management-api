import express from 'express';
const router = express.Router();
import { passportAuth } from '../middlewares/passport.js'
import { updateUserProfileValidation } from '../middlewares/validation.js'
import { roles } from '../constants.js'

import {
  getUserProfile,
  getUsers,
  getUser,
  deleteUsers,
  updateUsersStatus,
  updateUsersRoles,
  updateUser
} from '../controllers/users.js';

router.get('/me', passportAuth('jwt'), getUserProfile);

router.patch('/me', updateUserProfileValidation, passportAuth('jwt'), updateUser);

router.use(passportAuth('jwt', [roles.ADMIN]));

router.get('/', getUsers);

router.get('/:userId', getUser);

router.delete('/', deleteUsers);

router.patch('/status', updateUsersStatus);

router.patch('/roles', updateUsersRoles);

export default router;