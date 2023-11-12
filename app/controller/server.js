const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

_view = __dirname + "/../view";
const model = require(__dirname + "/../model/model.js");


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
    res.json(items);
  }).catch((err) => {
    console.log(err);
    res.json({status: "error"});
  })
});

app.get('/getItem', (req, res) => {
  model.getItem(req.query.id).then((item) => {
    res.json(item);
  }).catch((err) => {
    console.log(err);
    res.json({status: "error"});
  })
});




/**
 *  PROFILE DATA ROUTE
 *
 * 
 * 
 * Gets specific users data using id
 */

app.get('/profile/:getId(\\d+)',(req, res) => {

    model.getId().then((users) => {
      console.log("111");
      console.log(users);
      res.json(users[req.params.getId]);
    }).catch((err) =>{
      console.log(err);
      res.json({status: "error"});
    })
});

app.use("/static", express.static(path.resolve(_view, "static")));
app.use(express.static(_view));
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

