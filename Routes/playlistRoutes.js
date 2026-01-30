import express from 'express';
import Playlist from '../Model/Playlist.js';
import { authenticate } from '../Middleware/middleware.js'; // Assuming you have auth middleware

const router = express.Router();

// Add track to playlist (default 'Favorites')
router.post('/add', authenticate, async (req, res) => {
    try {
        const { track } = req.body;
        if (!track || !track.id) {
            return res.status(400).json({ message: "Invalid track data" });
        }

        const userId = req.user.id; // From auth middleware

        // Find or create playlist
        let playlist = await Playlist.findOne({ userId });

        if (!playlist) {
            playlist = new Playlist({ userId, name: 'Favorites', tracks: [] });
        }

        // Check if track already exists
        const exists = playlist.tracks.find(t => String(t.id) === String(track.id));
        if (exists) {
            return res.status(400).json({ message: "Track already in favorites" });
        }

        playlist.tracks.push(track);
        await playlist.save();

        res.status(200).json({ message: "Added to favorites", playlist });
    } catch (error) {
        console.error("Add Playlist Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get User's Playlist
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const playlist = await Playlist.findOne({ userId });
        res.status(200).json(playlist ? playlist.tracks : []);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Remove track
router.delete('/:trackId', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { trackId } = req.params;

        const playlist = await Playlist.findOne({ userId });
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        playlist.tracks = playlist.tracks.filter(t => String(t.id) !== String(trackId));
        await playlist.save();

        res.status(200).json({ message: "Removed from favorites", tracks: playlist.tracks });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
