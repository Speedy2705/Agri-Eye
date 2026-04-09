const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const ESP32_IP = process.env.ESP32_IP || '10.219.28.6';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET'],
  credentials: true,
}));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', esp32: ESP32_IP });
});

// Manual pipe — no proxy middleware, no pathRewrite bugs
app.get('/api/stream', (req, res) => {
  console.log(`[STREAM] Connecting to http://${ESP32_IP}:81/stream`);

  const options = {
    hostname: ESP32_IP,
    port: 81,
    path: '/stream',
    method: 'GET',
    headers: { Connection: 'keep-alive' },
  };

  const esp32Req = http.request(options, (esp32Res) => {
    console.log(`[STREAM] ESP32 responded: ${esp32Res.statusCode} ${esp32Res.headers['content-type']}`);

    // Forward headers to browser
    res.setHeader('Content-Type', esp32Res.headers['content-type'] || 'multipart/x-mixed-replace; boundary=frame');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.setHeader('Connection', 'keep-alive');
    res.status(esp32Res.statusCode);

    // Pipe the MJPEG stream directly to the browser
    esp32Res.pipe(res);

    esp32Res.on('end', () => console.log('[STREAM] ESP32 stream ended'));
  });

  esp32Req.on('error', (err) => {
    console.error('[STREAM] Error:', err.message);
    if (!res.headersSent) res.status(502).json({ error: err.message });
  });

  // If browser disconnects, kill the ESP32 request too
  req.on('close', () => {
    console.log('[STREAM] Browser disconnected, closing ESP32 connection');
    esp32Req.destroy();
  });

  esp32Req.end();
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`Stream endpoint: http://localhost:${PORT}/api/stream`);
});