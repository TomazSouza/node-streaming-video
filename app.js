const express = require("express");
const fs = require("fs");
const app = express();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/video", function(req, res) {

  console.log("request recebido");

  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range Header");
    return;
  }

  const videoPath = "bigbuck.mp4";
  const videoSize = fs.statSync("bigbuck.mp4").size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start  + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, {start, end});

  videoStream.pipe(res);
});

const host = "127.0.0.1";
const port = 8000;

app.listen(port, host, function() {
  console.log(`Server listening on http://${host}:${port}`);
});