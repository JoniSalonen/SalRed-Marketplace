const express = require('express');
const app = express();
const port = 3000;

// Connect to the database
const model = require('./../model/model.js');

_view = __dirname + '/../view';
app.use(express.static(_view));

// Define routes for different HTML files
app.get('/', (req, res) => {
  res.sendFile(_view + '/index.html');
});

app.get('/about', (req, res) => {
  res.sendFile(_view + '/about.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(_view + '/contact.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

