const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) {
            return res.status(400).json({ error: 'Missing URL parameter' });
        }

        console.log("Downloading video:", videoURL);

        const outputFile = 'video.mp4';

        // Remove previous file if exists
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }

        const command = `yt-dlp -f best -o ${outputFile} "${videoURL}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Download error:", error);
                return res.status(500).json({ error: stderr || 'Failed to download video' });
            }
            console.log("Download complete. Sending file...");
            res.download(outputFile, 'video.mp4', (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                }
                // Optionally delete file after sending
                if (fs.existsSync(outputFile)) {
                    fs.unlinkSync(outputFile);
                }
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.send('YT Downloader Backend using yt-dlp is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
