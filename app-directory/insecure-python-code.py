const http = require('http');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const sqlite3 = require('sqlite3').verbose();

// Create a new HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/api') {
        // Vulnerability: SQL Injection
        const userId = query.id;
        const db = new sqlite3.Database('database.db');
        db.get(`SELECT * FROM users WHERE id = ${userId}`, (err, row) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(row));
        });
        db.close();
    } else if (pathname === '/upload') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                // Vulnerability: Path Traversal
                const filePath = querystring.parse(body).filePath;
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                });
            });
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
