import express from 'express';
const router = express.Router();
import { passportAuth } from '../middlewares/passport.js';

import {
    getToken, getInventory, createItem
} from '../controllers/inventory.js'

router.post('/getToken', getToken);

router.get('/:apiToken', getInventory);

router.post('/:apiToken/item', createItem)

export default router;