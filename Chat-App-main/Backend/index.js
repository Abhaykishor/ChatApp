const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB');
const router = require('./routes/index');
const cookieParser = require('cookie-parser');
const {app,server} = require('./socket/index')

app.use(cors({
   origin: process.env.FRONTEND_URL,
   credentials: true
}));

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({
        message: "Server running at " + PORT
    });
});

app.use('/api', router);


connectDB().then(() => {
    // app.listen(PORT, () => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
}).catch(err => {
    console.error("Database connection error: ", err);
});






