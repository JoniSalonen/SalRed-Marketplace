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
function getItems() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM items';

    connection.query(query, (err, items) => {
      if (err) {
        reject(err);
      } else {
        console.log(items);
        resolve(items);
      }
    });
  });
}

  function getId(){
    return new Promise((resolve,reject)=>{
      const query = 'SELECT * FROM users';

      connection.query(query,(err, users) =>{
        if(err){
          reject(err);
        }else {
          console.log(users);
          resolve(users);
        }
      })
    })
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
  getId: getId,
};
