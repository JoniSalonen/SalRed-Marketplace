const mysql = require('mysql2');
require('dotenv').config();


var conn=mysql.createConnection(
    {
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT, 
    //ssl:{ca:fs.readFileSync("{ca-cert filename}")}
});

function testConn(){
    conn.connect((err) => {
        if (err) {
          console.error('Error connecting to the database: ' + err.stack);
          return;
        }
        console.log('Connected to the database as ID ' + conn.threadId);
      });
}

module.exports = { 
    test: testConn,

};
