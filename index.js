const express = require("express");

const path = require("path");

const app = express();

const port = 4001;

const hbs = require('hbs');

const fs = require('fs');

const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))
app.set('view engine', 'hbs')

const pgcet = path.join(__dirname, '/views')
app.use(express.static(pgcet))
app.set('view engine', 'hbs')
app.get('/', (req, res) => {
    res.render("index");   
});

const mime = require('mime-types');

app.get('/preview/questionPaper/:filename', (req, res) => {
    try {
        const filename=req.params.filename;
        const filePath = path.join(__dirname, 'public', 'QP', filename);

        if (fs.existsSync(filePath)) {
            const fileStream = fs.createReadStream(filePath);
            const contentType = mime.lookup(filePath) || 'application/octet-stream';

            res.setHeader('Content-Disposition', 'inline; filename=' + encodeURIComponent(filename));
            res.setHeader('Content-Type', contentType);

            fileStream.pipe(res);
        } else {
            res.status(404).send('File not found');
        }
    } catch (err) {
       console.log(err);
    }
});

app.get('/download/questionPaper/:filename', (req, res) => {
    try {
        const filename=req.params.filename;
        const filePath = path.join(__dirname, 'public', 'QP', filename);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Set the appropriate headers for the file download
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            res.setHeader('Content-Type', 'application/octet-stream');

            // Stream the file to the response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            // File not found
            res.status(404).send('File not found');
        }
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
