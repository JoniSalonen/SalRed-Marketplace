const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

// Connect to the database
const model = require(__dirname + "/../model/model.js");

_view = __dirname + "/../view";

console.log(__dirname);

app.use("/static", express.static(path.resolve(_view, "static")));

// Define routes for different HTML files
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(_view, "index.html")  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

