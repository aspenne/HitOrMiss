import express from 'express';
import { get } from '../controllers/songCtrl.js';
import { generateSpotifyToken } from '../middlewares/spotifyAuth.js';

const router = express.Router();

router.get('/random', generateSpotifyToken, get);

export default router;