const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");

process.chdir("/tmp"); // Use Railway writable dir

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("✅ YouTube Downloader Backend is Running!");
});

app.get("/download", (req, res) => {
    const videoURL = req.query.url;

    if (!videoURL || !videoURL.startsWith("http")) {
        return res.status(400).json({ error: "Missing or invalid URL. Use /download?url=VIDEO_URL" });
    }

    const fileName = `video_${Date.now()}.mp4`;

    const ytdlp = spawn("yt-dlp", [
    "--verbose",
    "--no-check-certificate",
    "--restrict-filenames",
    "--cookies", "cookies.txt",
    "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "-f", "best",
    "-o", fileName,
    videoURL
]);


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
                    res.status(500).json({ error: `File send error: ${err.message}` });
                }
                fs.unlink(fileName, () => {});
            });
        } else {
            res.status(500).json({ error: `yt-dlp exited with code ${code}. Check Railway logs for details.` });
        }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
