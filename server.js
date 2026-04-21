import express from "express";
import os from "os";

const app = express();
const PORT = 3000;
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
// Home route
app.get("/", (req, res) => {
  const uptime = process.uptime().toFixed(2);
  const memory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

  res.send(`
    <div style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
      <h1 style="color: #4CAF50;">✨ Welcome to My Express Server ✨</h1>
      <p>Server is running smoothly!</p>
      <hr style="width: 50%; margin: 20px auto;">
      <h3>Server Info:</h3>
      <ul style="list-style: none; padding: 0; font-size: 18px;">
        <li>Hostname: ${os.hostname()}</li>
        <li>Platform: ${os.platform()} (${os.type()})</li>
        <li>Uptime: ${uptime} seconds</li>
        <li>Memory Usage: ${memory} MB</li>
        <li>Node Version: ${process.version}</li>
      </ul>
    </div>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
