import express from "express";
import os from "os";

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = "1.4.0";

// Simple state to simulate environment switching in a demo
let isContainerMode = process.env.RUNNING_FROM === "container";

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Route to toggle mode (for portfolio demonstration)
app.get("/toggle-mode", (req, res) => {
  isContainerMode = !isContainerMode;
  res.redirect("/");
});

app.get("/", (req, res) => {
  const metrics = {
    uptime: `${Math.floor(process.uptime())}s`,
    memory: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
    hostname: os.hostname(),
    platform: os.platform(),
    node: process.version,
  };

  const modeLabel = isContainerMode ? "Containerized" : "Native OS";
  const themeColor = isContainerMode ? "#0db7ed" : "#4CAF50"; // Docker Blue vs Node Green

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>System Portfolio | v${VERSION}</title>
      <style>
        :root {
          --primary-color: ${themeColor};
          --bg-dark: #0f172a;
          --card-bg: rgba(30, 41, 59, 0.7);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: var(--bg-dark);
          background-image: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
          color: white;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .container {
          width: 90%;
          max-width: 800px;
          padding: 40px;
          border-radius: 24px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.1);
          color: var(--primary-color);
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 20px;
          border: 1px solid var(--primary-color);
        }

        h1 { font-size: 2.5rem; margin-bottom: 10px; letter-spacing: -1px; }
        p { color: #94a3b8; margin-bottom: 30px; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: rgba(15, 23, 42, 0.5);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-label { color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 8px; }
        .stat-value { font-family: 'Courier New', monospace; font-size: 1.1rem; color: #f8fafc; }

        .actions { display: flex; justify-content: center; gap: 15px; }

        .btn {
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }

        .btn-primary { background: var(--primary-color); color: white; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }

        .btn-outline { background: transparent; border: 1px solid #334155; color: #94a3b8; }
        .btn-outline:hover { background: rgba(255, 255, 255, 0.05); color: white; }

        .footer { margin-top: 30px; font-size: 0.8rem; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="badge">${modeLabel} Environment</div>
        <h1>System Monitor</h1>
        <p>Real-time server metrics for portfolio demonstration.</p>

        <div class="grid">
          <div class="stat-card">
            <div class="stat-label">Hostname</div>
            <div class="stat-value">${metrics.hostname}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Uptime</div>
            <div class="stat-value">${metrics.uptime}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Memory</div>
            <div class="stat-value">${metrics.memory}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Node Version</div>
            <div class="stat-value">${metrics.node}</div>
          </div>
        </div>

        <div class="actions">
          <a href="/toggle-mode" class="btn btn-primary">
            ${isContainerMode ? "🏠 Switch to Regular" : "📦 Switch to Container"}
          </a>
          <button onclick="location.reload()" class="btn btn-outline">Refresh Data</button>
        </div>

        <div class="footer">
          Build v${VERSION} • Running on ${metrics.platform}
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
});
