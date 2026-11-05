const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 30200;

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new Error('Cannot divide by zero');
      return a / b;
    default:
      throw new Error('Unknown operator: ' + op);
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, html) => {
      if (err) return sendJson(res, 500, { error: 'Could not load page' });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/calculate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { a, b, op } = JSON.parse(body);
        const x = Number(a);
        const y = Number(b);
        if (a === '' || b === '' || Number.isNaN(x) || Number.isNaN(y)) {
          return sendJson(res, 400, { error: 'Please enter two valid numbers' });
        }
        sendJson(res, 200, { result: calculate(x, y, op) });
      } catch (e) {
        sendJson(res, 400, { error: e.message });
      }
    });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Calculator running at http://localhost:${PORT}`);
});
