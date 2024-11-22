import axios from 'axios';
import base64 from 'base-64';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export const generateSpotifyToken = async (req, res, next) => {
    try {
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', null, {
            headers: {
                'Authorization': `Basic ${base64.encode(`${clientId}:${clientSecret}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                grant_type: 'client_credentials'
            }
        });

        req.spotifyToken = tokenResponse.data.access_token;
        next();
    } catch (error) {
        res.status(500).send('Error generating Spotify access token');
        console.log(error)
    }
};