const express = require('express');
const cors = require('cors');
const play = require('play-dl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }

        console.log("Fetching video:", videoURL);

        // Get stream using play-dl
        const stream = await play.stream(videoURL);
        const fileName = 'video.mp4';
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'video/mp4');

        stream.stream.pipe(res);
    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ error: error.message || 'Failed to download video' });
    }
});

app.get('/', (req, res) => {
    res.send('YT Downloader Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
