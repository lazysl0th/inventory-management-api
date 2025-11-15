import express from 'express';
const router = express.Router();
import { passportAuth } from '../middlewares/passport.js';

import {
  getLocation, addAdditionalInfo, getAdditionalInfo
} from '../controllers/salesForce.js'

router.use(passportAuth('jwt'));

router.get('/address', getLocation);

router.post('/addInfo', addAdditionalInfo);

router.post('/getInfo', getAdditionalInfo);

export default router;