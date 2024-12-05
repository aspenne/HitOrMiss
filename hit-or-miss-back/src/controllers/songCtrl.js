import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const get = async (req, res) => {
  try {
    const tracksDir = path.join(__dirname, '../../tracks');
    const files = fs.readdirSync(tracksDir);

    if (files.length === 0) {
      return res.status(404).send('No tracks found');
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const selectedFile = files[randomIndex];

    const [artist, song] = path.basename(selectedFile, path.extname(selectedFile)).split(' - ');

    res.json({
      track: `http://localhost:3001/tracks/${selectedFile}`,
      artist: artist,
      song: song
    });
  } catch (error) {
    console.log('Error fetching tracks:', error);
    res.status(500).send('Error fetching tracks');
  }
};