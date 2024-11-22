import axios from "axios";

export const get = async (req, res) => {
  try {
    const token = req.spotifyToken;
    let track = null;

    // Continue calling the API until a track with a preview_url is found
    while (!track || !track.preview_url) {
      const response = await axios.get(
        "https://api.spotify.com/v1/recommendations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            seed_genres: "pop",
            min_popularity: 70,
            limit: 1,
          },
        }
      );

      track = response.data.tracks[0];
    }

    res.json({ tracks: [track] });
  } catch (error) {
    res.status(500).send("Error calling the Spotify API");
  }
};
