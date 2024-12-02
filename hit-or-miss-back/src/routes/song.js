import express from 'express';
import { get } from '../controllers/songCtrl.js';

const router = express.Router();

router.get('', get);

export default router;