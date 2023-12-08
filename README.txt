# SalRed-Marketplace

Extract the files from the zip folder

Open the extracted folder with and IDE

In the terminal of the IDE go to the app folder

Run npm install

Install redis and run redis with:

sudo apt install redis-server
sudo service redis-server start

Use the DB-Dump files to create the database

Go to .env and change the values of: DB_HOST, DB_USER, DB_PASSWORD so that it can connect to your
local MySQL database

Start the app in the controller folder with: 

nodemon server.js

or

node server.js