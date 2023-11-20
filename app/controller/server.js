const express = require('express');
const path = require('path');
var session = require('express-session');
var validator = require('validator');
var bcrypt = require('bcrypt');
var redis = require('redis');
const multer = require('multer');
require('dotenv').config();

const RedisStore = require("connect-redis").default;
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = path.join(__dirname, '../view/media');
    cb(null, dir); // Save files to the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Change the filename to be a combination of the original filename and the current timestamp
    const uniqueFilename = req.session.user + "-" +file.originalname;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ storage: storage });

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
const utils = require(__dirname + "/utils.js");

app.use(express.json());

/**
 * Routes that do not want HTML but want to get data from the server
 * must be defined above the route that serves the html file
 */

app.get('/getItems', (req, res) => {
  var id = -1;
  if(req.session.user != null){
    id = req.session.userId;
  }
  model.getItems(id).then((items) => {
    res.json(items);
  }).catch((err) => {
    console.log(err);
    res.json({status: "error"});
  })
});


app.get('/getUserItems', (req, res) => {
  var name = req.query.name;
  model.getUserItems(name).then((items) => {
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
          console.log(err);
          res.json({status: "error", message: "Error, try again later"});
      }
      else{
        res.json({status: "ok"});
      }
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
        userRes.id = _user[0].id;
        userRes.sales = _user[0].sales;
        userRes.purchases = _user[0].purchases;
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


app.post("/buyItem", function (req, res){

  if(req.session.userId == null){
    res.json({status: "login"});
    return;
  }
  var id  = req.body.id;
  var userId = req.session.userId;
  var coins = 0;
  var price = 0;
  var ownerId = -1;

  model.getItem(id).then((_item) => {
    price = _item[0].price;
    ownerId = _item[0].owner_id;

    model.getUser(req.session.user).then((_user) => {
      coins = _user[0].coins;
      if(coins < price){
        res.json({status: "error", message: "Not enough coins"});
      }
      else{
        model.buyItem(id, userId, ownerId, price).then(() => {
          res.json({status: "ok"});
        }).catch((err) => {
          console.log(err);
          res.json({status: "error", message: "Error, try again later"});
        })
      }
    }).catch((err) => {
      console.log(err);
      res.json({status: "error", message: "Error, try again later"});
    })
  }).catch((err) => {
    console.log(err);
    res.json({status: "error", message: "Error, try again later"});
  })
});


app.post('/postAddItem', upload.single('image'), (req, res) => {
  // Access form fields and uploaded file using req.body and req.file
  const title = req.body.title;
  const description = req.body.description;
  const price = parseFloat(req.body.price);
  const image = req.file.filename;
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if(req.session.userId == null){
    res.json({status: "login"});
    utils.deleteFile(image);
    return;
  }
  
  if(sanitize(title) != title || sanitize(description) != description ||
      isNaN(price) || price < 0 ||
      !validator.isLength(title, {min: 1, max: 50}) || 
      !validator.isLength(description, {min: 1, max: 500}) ||
      !allowedTypes.includes(req.file.mimetype))
  {
    res.json({status: "error", message: "Invalid input"});
    utils.deleteFile(image);
    return;
  }
  var item = {};
  item.image = "/media/" + image;
  item.title = title; 
  item.description = description;
  item.price = price;
  item.owner_id = req.session.userId;
  model.addItem(item).then(() => {
    res.json({status: "ok"});
  }).catch((err) => {
    console.log(err);
    res.json({status: "error", message: "Error, try again later"});
    utils.deleteFile(image);
  })
});


app.get('/getCoins', (req, res) => {
  if(req.session.userId == null){
    res.json({status: "login"});
    return;
  }
  req.session.userId;
  //Give random number of coins between 1 and 100
  var coins = Math.floor(Math.random() * 100) + 1;
  model.addCoins(req.session.userId, coins).then((_user) => {
    res.json({status: "ok", coins: coins});
  }).catch((err) => {
    console.log(err);
    res.json({status: "error", message: "Error, try again later"});
  })
});


app.post('/postEditItem', (req, res) => {
  const id = req.body.id;
  const description = req.body.description;
  const price = parseFloat(req.body.price);
  
  if(req.session.userId == null){
    res.json({status: "login"});
    return;
  }
  
  if(isNaN(price) || price < 0 || sanitize(description) != description
  || !validator.isLength(description, {min: 1, max: 500})){
    res.json({status: "error", message: "Invalid input"});
    return;
  }
  
  model.getItem(id).then((_item) => {
    if(_item.length == 0){
      res.json({status: "error", message: "Item does not exist"});
    }
    else if(_item[0].owner_id != req.session.userId){
      res.json({status: "error", message: "You are not the owner of the item"});
    }
    else{
      var item = {};
      item.id = id;
      item.description = description;
      item.price = price;
      model.editItem(item).then(() => {
        res.json({status: "ok"});
      }).catch((err) => {
        console.log(err);
        res.json({status: "error", message: "Error, try again later"});
      })
    }
  });
});


app.get('/getUser', (req, res) => {
  
  var user = req.query.name;
  model.getUser(user).then((_user) => {
    if(_user.length == 0){
      res.json({status: "error"});
    }
    else{
      const userRes = {};
      userRes.name = _user[0].name;
      userRes.coins = _user[0].coins;
      userRes.id = _user[0].id;
      userRes.sales = _user[0].sales;
      userRes.purchases = _user[0].purchases;
      res.json({status: "ok", user: userRes});
    }
  }).catch((err) => {
    console.log(err);
    res.json({status: "error"});
  });
});


app.post(/deleteItem/, (req, res) => {
  const id = req.body.id;
  
  if(req.session.userId == null){
    res.json({status: "login"});
    return;
  }
  
  model.getItem(id).then((_item) => {
    if(_item.length == 0){
      res.json({status: "error", message: "Item does not exist"});
    }
    else if(_item[0].owner_id != req.session.userId){
      res.json({status: "error", message: "You are not the owner of the item"});
    }
    else{
      model.deleteItem(id).then(() => {
        utils.deleteFile(utils.filename(_item[0].image));
        res.json({status: "ok"});
      }).catch((err) => {
        console.log(err);
        res.json({status: "error", message: "Error, try again later"});
      })
    }
  });
});

//This server is for a SPA so we need to redirect all requests to the index.html file
//Here we define the middleware so that index.js works and images are displayed
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

