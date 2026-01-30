import express from 'express';
import { searchTracks } from '../Controller/jamendoController.js';

const router = express.Router();

// Route: /api/jamendo/search?q=...
router.get('/search', searchTracks);

export default router;
