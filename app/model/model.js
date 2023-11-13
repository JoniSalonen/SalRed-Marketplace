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
    const query = 'SELECT * FROM items WHERE owner_id != ?;';

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

function getUserItems(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM items WHERE owner_id = ?;';

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

function getUser(user) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE name = ?;';

    //Execute prepared statement, it is safer
    connection.query(query, [user], (err, user) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(user);
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
};
