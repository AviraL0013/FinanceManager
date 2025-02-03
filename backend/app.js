// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/User.route')

dotenv.config(); // Load environment variables
const connectToDb = require('./db/db');

connectToDb(); // Connect to the database
const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use('/users', userRoutes);

module.exports = app; // Export the app for use in server.js
