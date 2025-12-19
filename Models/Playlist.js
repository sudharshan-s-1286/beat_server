import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        default: 'Favorites'
    },
    tracks: [{
        id: String, // Jamendo ID
        name: String,
        artist_name: String,
        album_image: String,
        audio: String,
        duration: Number,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', PlaylistSchema);
export default Playlist;
