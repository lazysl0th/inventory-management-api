import express from 'express';
const router = express.Router();
import { passportAuth } from '../middlewares/passport.js';

import {
    getToken, getInventory
} from '../controllers/inventory.js'

//router.use(passportAuth('jwt'));

router.post('/getToken', getToken);

router.get('/:apiToken', getInventory);

export default router;