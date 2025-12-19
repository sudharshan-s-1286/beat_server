
import express from 'express';
import { getSpotifyToken } from '../Controller/spotifyController.js';
import { authenticate } from '../Middleware/middleware.js';

const router = express.Router();

// Protect this route so only logged-in users can get a token
router.get('/token', authenticate, getSpotifyToken);

export default router;
