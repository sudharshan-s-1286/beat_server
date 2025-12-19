
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getSpotifyToken = async (req, res) => {
    try {
        const client_id = process.env.SPOTIFY_CLIENT_ID?.trim();
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

        if (!client_id || !client_secret) {
            return res.status(500).json({ error: "Spotify credentials not set on server" });
        }

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'grant_type=client_credentials'
        };

        const response = await axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers });

        if (response.status === 200) {
            res.json({ access_token: response.data.access_token });
        } else {
            res.status(response.status).json({ error: 'Failed to fetch token from Spotify' });
        }
    } catch (error) {
        console.error('Spotify Token Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error fetching Spotify token' });
    }
};
