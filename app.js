const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors=require("cors");

app.use(cors());

// Middleware for handling cookies 
app.use(cookieParser());
//config
dotenv.config({path:"./config/config.env"});



app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Adjust the limit as needed
// Middleware for parsing URL-encoded data
app.use(bodyParser.urlencoded({extended:true}));


module.exports = app;