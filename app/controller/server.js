const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Connect to the database

_view = __dirname + "/../view";
const model = require(__dirname + "/../model/model.js");


app.use("/static", express.static(path.resolve(_view, "static")));
app.use(express.json());

/**
 * Routes that do not want HTML but want to get data from the server
 * must be defined above the route that serves the html file
 */
app.get('/getItems', (req, res) => {
  /**
   * Queries to the model must have this syntax
   * to handle requests asynchronously
   */
  model.getItems().then((items) => {
    console.log("2")
    console.log(items);
    res.json(items);
  }).catch((err) => {
    console.log(err);
    res.json({status: "error"});
  })
});

/**
 * This is the route that serves the html file, always the same for all routes
 */
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(_view, "index.html")  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

