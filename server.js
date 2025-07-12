const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");

process.chdir("/tmp"); // Ensure safe writeable directory

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

    const ytdlp = spawn("yt-dlp", ["--cookies", "cookies.txt", "-o", fileName, videoURL]);

    ytdlp.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    ytdlp.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    ytdlp.on("close", (code) => {
        console.log(`yt-dlp process exited with code ${code}`);
        if (code === 0) {
            res.download(fileName, fileName, (err) => {
                if (err) {
                    console.error(`File send error: ${err.message}`);
                }
                fs.unlink(fileName, () => {});
            });
        } else {
            res.status(500).json({ error: `yt-dlp exited with code ${code}` });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
