const express = require('express');
const path = require('path');
var session = require('express-session');
var validator = require('validator');
var bcrypt = require('bcrypt');
var redis = require('redis');
require('dotenv').config();

const RedisStore = require("connect-redis").default;
const app = express();

const saltRounds = 10;

let redisClient = redis.createClient();
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),  
    secret: process.env.SECRET_SESSION,
    resave: false,
	saveUninitialized: false
 })
);


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


app.post("/postRegister", function (req, res){
  var user  = req.body.user;
  var pwd  = req.body.pwd;

  user = sanitize(user);
  if(!validator.blacklist(user, '/\{}:;') === user 
  || !validator.escape(user) === user){
    res.json({status: "error", message: "Invalid username"});
  }
  else{
    model.getUser(user).then((_user) => {
      if(_user.length > 0){
        res.json({status: "error", message: "Username already exists"});
      }
      else{
        bcrypt.hash(pwd, saltRounds, function(err, hash) {
          model.addUser(user, hash).then(() => {
            res.json({status: "ok"});
          }).catch((err) => {
            console.log(err);
            res.json({status: "error", message: "Error, try again later"});
          })
        });
      }
    }).catch((err) => {
      console.log(err);
      res.json({status: "error", message: "Error, try again later"});
    })
  } 
});

app.post("/postLogin", function (req, res){
  var user  = req.body.user;
  var pwd  = req.body.pwd;

  user = sanitize(user);
  if(!validator.blacklist(user, '/\{}:;') === user 
  || !validator.escape(user) === user){
    res.json({status: "error", message: "Invalid username"});
  }
  else{
    model.getUser(user).then((_user) => {
      if(_user.length == 0){
        res.json({status: "error", message: "Username does not exist"});
      }
      else{
        bcrypt.compare(pwd, _user[0].passwd, function(err, result) {
          if(result){
            req.session.user = user;
            req.session.userId = _user[0].id;
            res.json({status: "ok"});
          }
          else{
            res.json({status: "error", message: "Wrong password"});
          }
        });
      }
    }).catch((err) => {
      console.log(err);
      res.json({status: "error", message: "Error, try again later"});
    })
  } 
});

app.post("/logout", function (req, res){
req.session.destroy( function (err) {
  if(err) {
          return console.log(err);
      }
      res.send("You have been logged out.");
});	
});

app.get('/getSession', (req, res) => {
  if(req.session.user != null){
    model.getUser(req.session.user).then((_user) => {
      if(_user.length == 0){
        res.json({status: "error"});
      }
      else{
        const userRes = {};
        userRes.name = _user[0].name;
        userRes.coins = _user[0].coins;
        res.json({status: "ok", user: userRes});
      }
    }).catch((err) => {
      console.log(err);
      res.json({status: "error"});
    });
  }
  else{
    res.json({status: "error"});
  }
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

function sanitize(str){
  str = validator.blacklist(str, '/\{}:;');
  str = validator.escape(str);
  str = validator.trim(str);
  return str;
}

