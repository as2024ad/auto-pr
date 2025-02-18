const http = require('http');
const url = require('url');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

// Hardcoded Credentials
const hardcodedPassword = "VeryInsecurePassword123";
const apiKey = "12345-ABCDE-67890-FGHIJ";

// Insecure Encryption
const encryptData = (data) => {
    // Using an insecure encryption algorithm (e.g., DES)
    const cipher = crypto.createCipher('des', '12345678');
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Deserialization Vulnerability - assuming a deserialized object could be tampered
const deserializeData = (data) => {
    // Using `eval` on user input, which can execute arbitrary code
    return eval(data);
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/api') {
        // SQL Injection Vulnerability
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
                // Path Traversal Vulnerability
                const filePath = query.filePath;
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
    } else if (pathname === '/login') {
        // Missing Authentication/Authorization Vulnerability
        // No authentication mechanism for this endpoint, hardcoded password used
        const password = query.password || "";
        if (password === hardcodedPassword) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Login Successful');
        } else {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
        }
    } else if (pathname === '/secure-endpoint') {
        // Broken Access Control
        // No check on API key or user authentication
        const apiKeyHeader = req.headers['x-api-key'] || "";
        if (apiKeyHeader === apiKey) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Access Granted');
        } else {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Unauthorized');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
