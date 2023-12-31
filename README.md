# ISE

## Prerequisites:

Node.js
Python
MongoDB
Any other dependencies or services

## Installation

### Navigate to the backend directory:
./

### Install Python dependencies:
pip install -r requirements.txt

### Starting the Backend:
python app.py

### Navigate to the frontend directory:
cd ./trading-platform-frontend
npm install

### Starting the Frontend:
npm start

The application should now be running, with the frontend accessible at http://localhost:3000 and the backend typically at http://localhost:5000

You can use the mongo shell to interact with your MongoDB instance.
### Start the MongoDB Shell:
Open your command line or terminal and enter mongo. This will start the MongoDB shell connected to your local MongoDB instance.

### In the MongoDB shell, switch to your new database by typing:
use TradingPlatformDB

### To create a new collection named users, you can use the db.createCollection method:
db.createCollection("users")

## Using MongoDB Compass
### Open MongoDB Compass:
Start MongoDB Compass, the GUI for MongoDB, which you can download from the MongoDB website if you haven't already.

### Connect to Your MongoDB Instance:
Connect to your local MongoDB instance. The default connection string for a local MongoDB instance is usually mongodb://localhost:27017.

### Create the Database and Collection:
In MongoDB Compass, click on "CREATE DATABASE" on the right side of the window.
Enter TradingPlatformDB as the Database Name.
Enter users as the Collection Name.
Click "Create Database".