import express from 'express';
const router = express.Router();
import { passportAuth } from '../middlewares/passport.js'

import {
  getUser,
} from '../controllers/users.js';
/*
import {
  getUsers,
  getUser,
  deleteUserByCredentials,
//  deleteUnverifiedUser,
  updateBlockStatus,
  updateActiveStatus,
} from '../controllers/users.js';*/

router.get('/me', passportAuth('jwt'), getUser);
/*
router.use(authRoles(roles.ADMIN));

router.get('/', getUsers);

//router.delete('/', deleteUserByCredentials);

//router.delete('/status/unverified', deleteUnverifiedUser);

router.patch('/status/blocked', updateBlockStatus);

router.patch('/status/unblocked', updateActiveStatus);
*/
export default router;