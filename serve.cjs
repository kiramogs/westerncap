const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5173;
const ROOT = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, content, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
  res.end(content);
}

function tryFile(filePath) {
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
  } catch (_) {}
  return null;
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURI(new URL(req.url, `http://${req.headers.host}`).pathname);
    let filePath = path.join(ROOT, urlPath);

    // If path ends with '/', serve index.html
    if (urlPath.endsWith('/')) {
      filePath = path.join(ROOT, urlPath, 'index.html');
    }

    // If no extension, try clean URL mapping to index.html
    if (!path.extname(filePath)) {
      const asIndex = path.join(ROOT, urlPath, 'index.html');
      const directIndex = path.join(ROOT, `${urlPath}.html`);
      filePath = tryFile(asIndex) || tryFile(directIndex) || filePath;
    }

    // Default to direct file
    const resolved = tryFile(filePath);
    if (!resolved) {
      return send(res, 404, 'Not Found');
    }

    const ext = path.extname(resolved).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    fs.createReadStream(resolved).on('error', () => send(res, 500, 'Server Error')).pipe(res);
    res.writeHead(200, { 'Content-Type': type });
  } catch (e) {
    send(res, 500, 'Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});

