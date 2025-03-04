const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/convert", async (req, res) => {
    const videoUrl = req.query.video;
    if (!videoUrl) return res.status(400).send("Provide an M3U8 URL");

    const tempFile = path.join(__dirname, "input.m3u8");
    const outputFile = path.join(__dirname, "output.mp4");

    try {
        const response = await axios.get(videoUrl, { responseType: "stream" });
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);
        await new Promise((resolve) => writer.on("finish", resolve));

        ffmpeg(tempFile)
            .output(outputFile)
            .on("end", () => {
                res.download(outputFile, "video.mp4", () => {
                    fs.unlinkSync(tempFile);
                    fs.unlinkSync(outputFile);
                });
            })
            .on("error", (err) => res.status(500).send(err.message))
            .run();
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
