const mysql = require('mysql2');
require('dotenv').config();


var connection = mysql.createConnection(
    {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT, 
    //ssl:{ca:fs.readFileSync("{ca-cert filename}")}
});

/**
 * Functions in the model must return a promise to handle requests asynchronously
 * @returns {Promise} A promise that resolves to an array of items
 */
function getItems(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT items.* FROM items WHERE owner_id != ?;';

    connection.query(query, [id],(err, items) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(items);
      }
    });
  });
}

function getUser(name){
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE name = ?;';

    connection.query(query, [name],(err, user) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

function getUserItems(name) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT items.* FROM items INNER JOIN users ON items.owner_id = users.id WHERE users.name = ?;';

    connection.query(query, [name],(err, items) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(items);
      }
    });
  });
}

function getItem(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT items.*, users.name FROM items INNER JOIN users ON items.owner_id = users.id WHERE items.id = ?;';

    //Execute prepared statement, it is safer
    connection.query(query, [id], (err, item) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(item);
      }
    });
  });
}

function addUser(user, hash){
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (name, passwd) VALUES (?, ?);';

    //Execute prepared statement, it is safer
    connection.query(query, [user, hash], (err, user) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

function buyItem(id, buyer_id, owner_id, price){
  return new Promise((resolve, reject) => {
    const queryAddSale = 'UPDATE users SET sales = sales + 1 WHERE id = ?;';
    const queryChangeOwner = 'UPDATE items SET owner_id = ? WHERE id = ?;';
    const queryChangeCoins = 'UPDATE users SET coins = coins - ?, purchases = purchases + 1 WHERE id = ?;';
    const queryRecordSale = 'INSERT INTO sales (seller_id, buyer_id, item_id, price) VALUES (?, ?, ?, ?);'
    //Execute prepared statement, it is safer
    connection.query(queryAddSale, [owner_id], (err, item) => {
      if(err){
        console.log(err);
        reject(err);
      }else{
        connection.query(queryChangeOwner, [buyer_id, id], (err, item) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            connection.query(queryChangeCoins, [price, buyer_id], (err, user) => {
              if (err) {
                console.log(err);
                reject(err);
              } else {
                connection.query(queryRecordSale, [owner_id, buyer_id, id, price], (err, sale) => {
                  if (err) {
                    console.log(err);
                    reject(err);
                  } else {
                    resolve(true);
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}

function addItem(item){
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO items (owner_id, title, description, price, image) VALUES (?, ?, ?, ?, ?);';

    //Execute prepared statement, it is safer
    connection.query(query, [item.owner_id, item.title, item.description, item.price, item.image], (err, item) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function addCoins(id, coins){
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET coins = coins + ? WHERE id = ?;';

    //Execute prepared statement, it is safer
    connection.query(query, [coins, id], (err, item) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function editItem(item){
  return new Promise((resolve, reject) => {
    const query = 'UPDATE items SET description = ?, price = ? WHERE id = ?;';

    //Execute prepared statement, it is safer
    connection.query(query, [item.description, item.price, item.id], (err, item) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function deleteItem(id){
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM items WHERE id = ?;';

    //Execute prepared statement, it is safer
    connection.query(query, [id], (err, item) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function testConn(){
  connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database: ' + err.stack);
          return;
        }
        console.log('Connected to the database as ID ' + connection.threadId);
      });
}

/**
 * Export the functions so that they can be used in server.js
 */
module.exports = { 
  testConn: testConn,
  getItems: getItems,
  getItem: getItem,
  getUser: getUser,
  addUser: addUser,
  getUserItems: getUserItems,
  buyItem: buyItem,
  addItem: addItem,
  addCoins: addCoins,
  editItem: editItem,
  deleteItem: deleteItem
};
