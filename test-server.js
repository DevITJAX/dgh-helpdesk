const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile('test-login.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading test-login.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    console.log('Open this URL in your browser to test the login API');
}); 