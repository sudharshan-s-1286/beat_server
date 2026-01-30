import axios from 'axios';

// Search Tracks (proxies to Jamendo API)
export const searchTracks = async (req, res) => {
    try {
        const { q, order } = req.query; // Get 'order' param
        if (!q) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const clientId = process.env.JAMENDO_CLIENT_ID;
        if (!clientId) {
            console.error("Missing JAMENDO_CLIENT_ID in .env");
            return res.status(500).json({ message: "Server configuration error" });
        }

        // Call Jamendo API v3
        // We ask for track name, artist name, album image, and audio stream
        // 'order' param: popularity_total, releasedate, name, duration, etc.
        const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
            params: {
                client_id: clientId,
                format: 'json',
                limit: 20,
                search: q,
                order: order || 'popularity_total', // Default to popularity if not provided
                include: 'musicinfo' // Getting extra info if needed
            }
        });

        const tracks = response.data.results.map(track => ({
            id: track.id,
            name: track.name,
            artist_name: track.artist_name,
            album_image: track.album_image, // standard resolution
            audio: track.audio, // stream URL
            duration: track.duration
        }));

        res.status(200).json({ results: tracks });

    } catch (error) {
        console.error("Jamendo Search Error:", error.message);
        res.status(500).json({ message: "Failed to fetch tracks from Jamendo" });
    }
};
