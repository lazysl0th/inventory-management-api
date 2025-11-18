import express from 'express';
const router = express.Router();

import {
    sendSupportRequest
} from '../controllers/support.js'

router.post('/', sendSupportRequest);

export default router;