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

// Route to toggle mode (handled via Nginx reverse proxy)
app.get("/toggle-mode", (req, res) => {
  if (isContainerMode) {
    isContainerMode = false;
    res.redirect("/");
  } else {
    isContainerMode = true;
    res.redirect("/container");
  }
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
  const themeColor = isContainerMode ? "#0db7ed" : "#4CAF50";

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
          max-width: 900px;
          padding: 40px;
          border-radius: 24px;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .header { text-align: center; margin-bottom: 30px; }

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
        .subtitle { color: #94a3b8; margin-bottom: 30px; text-align: center; }

        .main-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }

        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .stat-card {
          background: rgba(15, 23, 42, 0.5);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .stat-label { color: #64748b; font-size: 0.7rem; text-transform: uppercase; margin-bottom: 5px; }
        .stat-value { font-family: 'Courier New', monospace; font-size: 1rem; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; }

        .pipeline-card {
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 16px;
          border-left: 4px solid var(--primary-color);
          text-align: left;
        }

        .pipeline-card h3 { font-size: 0.9rem; color: var(--primary-color); margin-bottom: 15px; text-transform: uppercase; }
        .step { font-size: 0.85rem; margin-bottom: 10px; color: #cbd5e1; display: flex; align-items: flex-start; }
        .step::before { content: '✔'; margin-right: 10px; color: var(--primary-color); }

        .actions { display: flex; justify-content: center; gap: 15px; margin-top: 30px; }

        .btn {
          padding: 12px 24px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          font-size: 0.9rem;
        }

        .btn-primary { background: var(--primary-color); color: white; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }

        .btn-outline { background: transparent; border: 1px solid #334155; color: #94a3b8; }
        .btn-outline:hover { background: rgba(255, 255, 255, 0.05); color: white; }

        .footer { margin-top: 30px; font-size: 0.75rem; color: #475569; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">${modeLabel} Mode</div>
          <h1>Infrastructure Dashboard</h1>
        </div>
        
        <p class="subtitle">Traffic routed via <strong>Nginx Reverse Proxy</strong> to internal service on port ${PORT}</p>

        <div class="main-layout">
          <div class="metrics-section">
            <div class="grid">
              <div class="stat-card"><div class="stat-label">Hostname</div><div class="stat-value">${metrics.hostname}</div></div>
              <div class="stat-card"><div class="stat-label">Uptime</div><div class="stat-value">${metrics.uptime}</div></div>
              <div class="stat-card"><div class="stat-label">Memory</div><div class="stat-value">${metrics.memory}</div></div>
              <div class="stat-card"><div class="stat-label">Node</div><div class="stat-value">${metrics.node}</div></div>
            </div>
            
            <div class="actions">
              <a href="/toggle-mode" class="btn btn-primary">
                ${isContainerMode ? "🏠 Switch to Regular Route" : "📦 Switch to Container Route"}
              </a>
              <button onclick="location.reload()" class="btn btn-outline">Refresh</button>
            </div>
          </div>

          <div class="pipeline-card">
            <h3>CI/CD Architecture</h3>
            <div class="step">GitHub Push triggers 2 Workflows</div>
            <div class="step">Workflow 1: Direct Deployment to Production</div>
            <div class="step">Workflow 2: Build & Push to GHCR (Container Registry)</div>
            <div class="step">Watchtower monitors GHCR and auto-updates images</div>
          </div>
        </div>

        <div class="footer">
          Build v${VERSION} • Managed by Nginx • Deployment: GitHub Actions + Watchtower
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Portfolio Server running at http://localhost:${PORT}`);
});
