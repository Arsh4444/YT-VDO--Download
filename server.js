const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("YouTube Downloader Backend is Running ✅");
});

app.get("/download", (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) {
        return res.status(400).json({ error: "Missing URL" });
    }

    const fileName = `video_${Date.now()}.mp4`;
    const outputFile = path.join(__dirname, fileName);

    // This line uses yt-dlp with your cookies.txt to bypass login/CAPTCHA
    const command = `yt-dlp --cookies cookies.txt -o "${outputFile}" "${videoURL}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Download error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`yt-dlp stderr: ${stderr}`);
        }
        console.log(`yt-dlp stdout: ${stdout}`);

        res.download(outputFile, fileName, (err) => {
            if (err) {
                console.error(`File send error: ${err.message}`);
            }
            fs.unlink(outputFile, () => {}); // Clean up downloaded file after sending
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
