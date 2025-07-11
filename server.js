const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }

        console.log("Received download request for:", videoURL);

        const info = await ytdl.getInfo(videoURL);
        console.log("Video info fetched:", info.videoDetails.title);

        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        console.log("Format chosen:", format.qualityLabel);

        res.header('Content-Disposition', `attachment; filename="video.mp4"`);
        ytdl(videoURL, { format: format }).pipe(res);
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
