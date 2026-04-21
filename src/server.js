import express from "express";
import os from "os";

const app = express();
const PORT = 3000;
const VERSION = "1.3.0";
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
const RUNNING_FROM =
  process.env.RUNNING_FROM === "container" ? "container" : "regular";
// Home route

app.get("/", (req, res) => {
  const uptime = process.uptime().toFixed(2);
  const memory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

  const nav =
    RUNNING_FROM === "regular"
      ? `<a href="/container" style="margin-left: 20px;">📦 Go to Container</a>`
      : `<a href="/" style="margin-left: 20px;">🏠 Go to Regular</a>`;

  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
      <h1 style="color: #4CAF50;">✨ Welcome to My Express Server ✨</h1>
      <p>Server is running smoothly!</p>

      <hr style="width: 50%; margin: 20px auto;">

      <div style="margin-bottom: 20px;">
        ${nav}
      </div>

      <h3>Server Info:</h3>
      <ul style="list-style: none; padding: 0; font-size: 18px;">
        <li>Hostname: ${os.hostname()}</li>
        <li>Platform: ${os.platform()} (${os.type()})</li>
        <li>Uptime: ${uptime} seconds</li>
        <li>Memory Usage: ${memory} MB</li>
        <li>Node Version: ${process.version}</li>
        <li>Version: ${VERSION}</li>
        <li>Running From: ${RUNNING_FROM}</li>
      </ul>
    </div>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
