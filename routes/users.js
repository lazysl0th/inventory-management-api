import express from 'express';
const router = express.Router();
import { passportAuth } from '../middlewares/passport.js'
import { roles } from '../constants.js'

import {
  getUserProfile,
  getUsers,
  deleteUsers,
  updateUsersStatus,
  updateUsersRoles
} from '../controllers/users.js';

router.get('/me', passportAuth('jwt'), getUserProfile);

router.use(passportAuth('jwt', [roles.ADMIN]));

router.get('/', getUsers);

router.delete('/', deleteUsers);

router.patch('/status', updateUsersStatus);

router.patch('/roles', updateUsersRoles);

export default router;