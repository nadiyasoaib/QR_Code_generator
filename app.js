const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies (form submissions)~
app.use(express.urlencoded({ extended: true }));

// Home route (serves the HTML form)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Generate QR code and serve the result
app.post('/generate', (req, res) => {
    const url = req.body.url;
    QRCode.toDataURL(url, (err, src) => {
        if (err) {
            return res.send('Error generating QR code');
        }

        // Read the result.html file, insert the QR code image, and send it back
        fs.readFile(path.join(__dirname, 'public', 'result.html'), 'utf8', (err, data) => {
            if (err) {
                return res.send('Error loading result page');
            }

            const resultPage = data.replace('{{QR_CODE_SRC}}', src);
            res.send(resultPage);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
